"use client";

import { useState } from "react";
import styles from "../products/products.module.css";
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Package,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrders() {
    const [orders, setOrders] = useState([
        { 
            id: "#ORD-9921", 
            customer: "Moussa Diop", 
            date: "12 Mai 2024", 
            total: 15500, 
            status: "En attente",
            items: "3x Pommes, 1x Jus Orange"
        },
        { 
            id: "#ORD-9920", 
            customer: "Fatou Sow", 
            date: "12 Mai 2024", 
            total: 3500, 
            status: "En préparation",
            items: "1x Panier Mixte"
        },
        { 
            id: "#ORD-9919", 
            customer: "Ibrahima Fall", 
            date: "11 Mai 2024", 
            total: 25000, 
            status: "Livré",
            items: "5x Bananes, 2x Mangues Kent"
        },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "En attente": return "#FF9800";
            case "En préparation": return "#2196F3";
            case "Livré": return "#4CAF50";
            case "Annulé": return "#F44336";
            default: return "#888";
        }
    };

    const updateStatus = (orderId: string, newStatus: string) => {
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    return (
        <div className={styles.productPage}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Gestion des Commandes</h1>
                    <p>{orders.length} commandes au total</p>
                </div>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID Commande</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Statut</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, i) => (
                            <motion.tr 
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <td style={{ fontWeight: 800, color: 'var(--primary-green)' }}>{order.id}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 700 }}>{order.customer}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{order.items}</span>
                                    </div>
                                </td>
                                <td><span className={styles.priceTag}>{order.total.toLocaleString()} CFA</span></td>
                                <td>
                                    <span style={{ 
                                        padding: '0.4rem 1rem', 
                                        borderRadius: '20px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 700, 
                                        backgroundColor: `${getStatusColor(order.status)}15`,
                                        color: getStatusColor(order.status),
                                        border: `1px solid ${getStatusColor(order.status)}30`
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ color: '#666', fontSize: '0.9rem' }}>{order.date}</td>
                                <td>
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        style={{ 
                                            padding: '0.4rem', 
                                            borderRadius: '8px', 
                                            border: '1px solid #eee', 
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option>En attente</option>
                                        <option>En préparation</option>
                                        <option>Livré</option>
                                        <option>Annulé</option>
                                    </select>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
