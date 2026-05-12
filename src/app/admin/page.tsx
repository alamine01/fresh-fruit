"use client";

import styles from "./admin.module.css";
import { 
    ShoppingBag, 
    TrendingUp, 
    Package, 
    ArrowUpRight 
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

const data = [
    { name: 'Lun', revenue: 45000 },
    { name: 'Mar', revenue: 52000 },
    { name: 'Mer', revenue: 48000 },
    { name: 'Jeu', revenue: 61000 },
    { name: 'Ven', revenue: 55000 },
    { name: 'Sam', revenue: 85000 },
    { name: 'Dim', revenue: 72000 },
];

export default function AdminDashboard() {
    const stats = [
        { 
            label: "Total Produits", 
            value: "42", 
            icon: Package, 
            color: "#2E7D32",
            trend: "+3 cette semaine"
        },
        { 
            label: "Ventes du mois", 
            value: "1.2M CFA", 
            icon: ShoppingBag, 
            color: "#E65100",
            trend: "+12.5%"
        },
        { 
            label: "Croissance", 
            value: "24%", 
            icon: TrendingUp, 
            color: "#8E24AA",
            trend: "Stable"
        }
    ];

    return (
        <div className={styles.dashboard}>
            <header className={styles.dashboardHeader}>
                <h1>Tableau de Bord</h1>
                <p>Bienvenue dans votre espace de gestion Fresh Fruit.</p>
            </header>

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
                        <option>30 derniers jours</option>
                    </select>
                </div>
                
                <div style={{ width: '100%', height: 400, marginTop: '2rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
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
                                tickFormatter={(value) => `${value/1000}k`}
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
        </div>
    );
}
