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

    const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
                            <th>Client</th>
                            <th className={styles.hideMobile}>Total</th>
                            <th>Statut</th>
                            <th>Détails</th>
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
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 700 }}>{order.customer}</span>
                                        <span className={styles.hideMobile} style={{ fontSize: '0.8rem', color: '#888' }}>{order.items}</span>
                                    </div>
                                </td>
                                <td className={styles.hideMobile}><span className={styles.priceTag}>{order.total.toLocaleString()} CFA</span></td>
                                <td>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 700, 
                                        backgroundColor: `${getStatusColor(order.status)}15`,
                                        color: getStatusColor(order.status),
                                        border: `1px solid ${getStatusColor(order.status)}30`
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className={styles.actionBtn} 
                                        style={{ backgroundColor: 'var(--primary-green)', color: 'white' }}
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <ChevronDown size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                        <motion.div 
                            className={styles.modal}
                            onClick={e => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2>Détails de la commande</h2>
                                <button onClick={() => setSelectedOrder(null)} className={styles.closeBtn}>&times;</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '15px' }}>
                                    <p style={{ fontSize: '0.9rem', color: '#888' }}>ID Commande</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-green)' }}>{selectedOrder.id}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Client</p>
                                        <p style={{ fontWeight: 700 }}>{selectedOrder.customer}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Date</p>
                                        <p style={{ fontWeight: 700 }}>{selectedOrder.date}</p>
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Produits</p>
                                    <p style={{ background: '#fff', border: '1px solid #eee', padding: '1rem', borderRadius: '10px' }}>{selectedOrder.items}</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Total à payer</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>{selectedOrder.total.toLocaleString()} CFA</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Modifier Statut</p>
                                        <select 
                                            value={selectedOrder.status} 
                                            onChange={(e) => {
                                                updateStatus(selectedOrder.id, e.target.value);
                                                setSelectedOrder({...selectedOrder, status: e.target.value});
                                            }}
                                            style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid #eee' }}
                                        >
                                            <option>En attente</option>
                                            <option>En préparation</option>
                                            <option>Livré</option>
                                            <option>Annulé</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
