"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { 
    ShoppingBag, 
    TrendingUp, 
    Package, 
    ArrowUpRight,
    Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip 
} from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Récupérer les produits
        const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
            const productCount = snapshot.size;
            
            // 2. Récupérer les commandes pour les ventes et le graphique
            const unsubOrders = onSnapshot(collection(db, "orders"), (orderSnap) => {
                let totalRevenue = 0;
                const dailyRevenue: { [key: string]: number } = {};
                
                orderSnap.forEach(doc => {
                    const data = doc.data();
                    const rev = data.total || 0;
                    totalRevenue += rev;

                    // Préparation des données du graphique (7 derniers jours simplifiés)
                    if (data.createdAt) {
                        const date = data.createdAt.toDate().toLocaleDateString('fr-FR', { weekday: 'short' });
                        dailyRevenue[date] = (dailyRevenue[date] || 0) + rev;
                    }
                });

                // Formater les données pour Recharts
                const formattedChartData = Object.entries(dailyRevenue).map(([name, revenue]) => ({
                    name,
                    revenue
                })).slice(-7);

                setChartData(formattedChartData.length > 0 ? formattedChartData : [
                    { name: 'Lun', revenue: 0 },
                    { name: 'Mar', revenue: 0 },
                    { name: 'Mer', revenue: 0 },
                    { name: 'Jeu', revenue: 0 },
                    { name: 'Ven', revenue: 0 },
                    { name: 'Sam', revenue: 0 },
                    { name: 'Dim', revenue: 0 },
                ]);

                setStats([
                    { 
                        label: "Total Produits", 
                        value: productCount.toString(), 
                        icon: Package, 
                        color: "#2E7D32",
                        trend: "Catalogue actif"
                    },
                    { 
                        label: "Ventes totales", 
                        value: `${totalRevenue.toLocaleString()} CFA`, 
                        icon: ShoppingBag, 
                        color: "#E65100",
                        trend: "Revenu cumulé"
                    },
                    { 
                        label: "Commandes", 
                        value: orderSnap.size.toString(), 
                        icon: TrendingUp, 
                        color: "#8E24AA",
                        trend: "Total transactions"
                    }
                ]);
                setLoading(false);
            });

            return () => unsubOrders();
        });

        return () => unsubProducts();
    }, []);

    return (
        <div className={styles.dashboard}>
            <header className={styles.dashboardHeader}>
                <h1>Tableau de Bord</h1>
                <p>Bienvenue dans votre espace de gestion Fresh Fruit.</p>
            </header>

            {loading ? (
                <div style={{ padding: '10rem', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary-green)', margin: '0 auto' }} />
                    <p style={{ marginTop: '1rem', color: '#666' }}>Analyse des données en cours...</p>
                </div>
            ) : (
                <>
                    <div className={styles.statsGrid}>
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div 
                                    key={i}
                                    className={styles.statCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className={styles.iconBox} style={{ backgroundColor: stat.color }}>
                                        <Icon size={24} />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <h3>{stat.label}</h3>
                                        <div className={styles.statValue}>{stat.value}</div>
                                        <span style={{ fontSize: '0.75rem', color: '#4caf50', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <ArrowUpRight size={12} /> {stat.trend}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.section 
                        className={styles.chartSection}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className={styles.chartHeader}>
                            <h2>Revenus de la semaine</h2>
                            <select className={styles.chartSelect}>
                                <option>7 derniers jours</option>
                            </select>
                        </div>
                        
                        <div style={{ width: '100%', height: 400, marginTop: '2rem' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary-green)" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="var(--primary-green)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#888', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#888', fontSize: 12 }}
                                        tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [`${Number(value).toLocaleString()} CFA`, 'Revenu']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="var(--primary-green)" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.section>
                </>
            )}
        </div>
    );
}
