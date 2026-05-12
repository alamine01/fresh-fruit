"use client";

import styles from "./admin.module.css";
import { 
    ShoppingBag, 
    TrendingUp, 
    Package, 
    ArrowUpRight 
} from "lucide-react";
import { motion } from "framer-motion";

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
                                <Icon size={28} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>{stat.label}</h3>
                                <div className={styles.statValue}>{stat.value}</div>
                                <span style={{ fontSize: '0.8rem', color: '#4caf50', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ArrowUpRight size={14} /> {stat.trend}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Placeholder for charts or recent activity */}
            <section className={styles.recentActivity}>
                <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', textAlign: 'center', border: '2px dashed #eee' }}>
                    <h2 style={{ color: '#ccc' }}>Graphiques de ventes à venir...</h2>
                </div>
            </section>
        </div>
    );
}
