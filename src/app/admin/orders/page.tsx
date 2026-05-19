"use client";

import { useState, useEffect } from "react";
import styles from "../products/products.module.css";
import { db } from "@/lib/firebase";
import { 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    query, 
    orderBy 
} from "firebase/firestore";
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Package,
    ChevronDown,
    Phone,
    MapPin,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Synchronisation en temps réel avec Firestore
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => {
                const data = doc.data();
                let formattedDate = "Date inconnue";
                if (data.createdAt) {
                    const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    formattedDate = dateObj.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }) + " à " + dateObj.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
                return {
                    id: doc.id,
                    ...data,
                    date: formattedDate
                };
            });
            setOrders(ordersData);
            setLoading(false);
        }, (error) => {
            console.error("Erreur Firestore:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredOrders = orders.filter(order => {
        if (statusFilter === "all") return true;
        return order.status === statusFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "En attente": return "#FF9800";
            case "En préparation": return "#2196F3";
            case "Livré": return "#4CAF50";
            case "Annulé": return "#F44336";
            default: return "#888";
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });
        } catch (error) {
            console.error("Erreur mise à jour statut:", error);
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const updatePaymentStatus = async (orderId: string, newStatus: string) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { paymentStatus: newStatus });
        } catch (error) {
            console.error("Erreur mise à jour paiement:", error);
            alert("Erreur lors de la mise à jour du paiement");
        }
    };

    return (
        <div className={styles.productPage}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Gestion des Commandes</h1>
                    <p>{orders.length} commandes au total</p>
                </div>
            </header>

            {loading ? (
                <div className={styles.tableContainer}>
                    <div style={{ padding: '5rem', textAlign: 'center' }}>
                        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-green)', margin: '0 auto' }} />
                        <p style={{ marginTop: '1rem', color: '#666' }}>Chargement des commandes...</p>
                    </div>
                </div>
            ) : (
                <div className="orders-content">
                    <div className={styles.actionBar}>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600, color: '#666' }}>Filtrez vos commandes pour un meilleur suivi</p>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <button 
                                className={styles.filterSelect}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.8rem',
                                    justifyContent: 'space-between',
                                    paddingRight: '1rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Clock size={18} style={{ color: statusFilter === "all" ? "#888" : getStatusColor(statusFilter) }} />
                                    <span>
                                        {statusFilter === "all" ? "Tous les statuts" : statusFilter}
                                    </span>
                                </div>
                                <ChevronDown size={16} style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                            </button>

                            <AnimatePresence>
                                {isFilterOpen && (
                                    <motion.div 
                                        className={styles.dropdown}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{ width: '220px', padding: '0.5rem', right: 0 }}
                                    >
                                        <button 
                                            onClick={() => { setStatusFilter("all"); setIsFilterOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '10px' }}
                                        >
                                            <Package size={16} /> Tous
                                        </button>
                                        <button 
                                            onClick={() => { setStatusFilter("En attente"); setIsFilterOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '10px' }}
                                        >
                                            <Clock size={16} color="#FF9800" /> En attente
                                        </button>
                                        <button 
                                            onClick={() => { setStatusFilter("En préparation"); setIsFilterOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '10px' }}
                                        >
                                            <ShoppingBag size={16} color="#2196F3" /> Préparation
                                        </button>
                                        <button 
                                            onClick={() => { setStatusFilter("Livré"); setIsFilterOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '10px' }}
                                        >
                                            <CheckCircle size={16} color="#4CAF50" /> Livré
                                        </button>
                                        <button 
                                            onClick={() => { setStatusFilter("Annulé"); setIsFilterOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '10px' }}
                                        >
                                            <XCircle size={16} color="#F44336" /> Annulé
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className={styles.tableContainer} style={{ overflow: 'visible' }}>
                        {filteredOrders.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                                <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                <p>Aucune commande correspondant à ce filtre.</p>
                            </div>
                        ) : (
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
                                    {filteredOrders.map((order, i) => (
                                        <motion.tr 
                                            key={order.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 700 }}>{order.customerName || (order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Anonyme")}</span>
                                                    <span className={styles.hideMobile} style={{ fontSize: '0.8rem', color: '#888' }}>{order.itemsSummary || "Détails indisponibles"}</span>
                                                </div>
                                            </td>
                                            <td className={styles.hideMobile}><span className={styles.priceTag}>{order.total?.toLocaleString() || 0} CFA</span></td>
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
                                                    {order.status || "En attente"}
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
                        )}
                    </div>
                </div>
            )}

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
                                        <p style={{ fontWeight: 700 }}>
                                            {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Phone size={14} style={{ color: 'var(--primary-green)' }} /> {selectedOrder.customer?.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Date</p>
                                        <p style={{ fontWeight: 700 }}>{selectedOrder.date}</p>
                                        <p style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <MapPin size={14} style={{ color: 'var(--primary-green)' }} /> {selectedOrder.customer?.neighborhood}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Produits</p>
                                    <div style={{ background: '#fff', border: '1px solid #eee', padding: '1rem', borderRadius: '10px' }}>
                                        {selectedOrder.items?.map((item: any, idx: number) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span>{item.quantity}x {item.name}</span>
                                                <span style={{ fontWeight: 700 }}>{(item.price * item.quantity).toLocaleString()} CFA</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Total à payer</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>{selectedOrder.total?.toLocaleString()} CFA</p>
                                        <span style={{ 
                                            display: 'inline-block', 
                                            marginTop: '0.5rem', 
                                            padding: '0.3rem 0.8rem', 
                                            borderRadius: '20px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 700, 
                                            backgroundColor: selectedOrder.paymentStatus === 'Payé' ? '#E8F5E9' : '#FFEBEE',
                                            color: selectedOrder.paymentStatus === 'Payé' ? '#2E7D32' : '#D32F2F'
                                        }}>
                                            {selectedOrder.paymentStatus === 'Payé' ? 'Payé' : 'Non payé'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <p style={{ fontSize: '0.8rem', color: '#888' }}>Paiement</p>
                                            <select 
                                                value={selectedOrder.paymentStatus || "Non payé"} 
                                                onChange={(e) => {
                                                    updatePaymentStatus(selectedOrder.id, e.target.value);
                                                    setSelectedOrder({...selectedOrder, paymentStatus: e.target.value});
                                                }}
                                                style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid #eee' }}
                                            >
                                                <option>Non payé</option>
                                                <option>Payé</option>
                                            </select>
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
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
