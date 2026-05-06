"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User, LogOut, ChevronRight, Clock, CheckCircle, Truck } from 'lucide-react';
import styles from './Account.module.css';

const orders = [
    { id: 'ORD-1234', date: '2026-02-10', total: '53.50', status: 'Livré', statusColor: '#4CAF50' },
    { id: 'ORD-5678', date: '2026-02-15', total: '12.00', status: 'En préparation', statusColor: '#FF9800' }
];

export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
    const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/account/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Chargement...</div>;
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className={`container ${styles.accountPage}`}>
            <motion.header
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Mon Espace Client</h1>
            </motion.header>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <nav className={styles.nav}>
                        <button
                            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
                            onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
                        >
                            <div className={styles.iconBox}>
                                <Package size={20} />
                            </div>
                            <span>Mes Commandes</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <div className={styles.iconBox}>
                                <User size={20} />
                            </div>
                            <span>Mon Profil</span>
                        </button>
                        <button className={`${styles.navItem} ${styles.logout}`} onClick={handleLogout}>
                            <div className={styles.iconBox}>
                                <LogOut size={20} />
                            </div>
                            <span>Déconnexion</span>
                        </button>
                    </nav>
                </aside>

                <main className={styles.mainContent}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'orders' && !selectedOrder && (
                            <motion.section
                                key="orders-list"
                                className={styles.section}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className={styles.sectionHeader}>
                                    <h2>Historique de vos commandes</h2>
                                </div>

                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>N° Commande</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Statut</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className={styles.orderId} data-label="Commande">{order.id}</td>
                                                    <td className={styles.date} data-label="Date">{order.date}</td>
                                                    <td className={styles.total} data-label="Total">{order.total.toLocaleString()} CFA</td>
                                                    <td data-label="Statut">
                                                        <span
                                                            className={styles.statusBadge}
                                                            style={{
                                                                backgroundColor: `${order.statusColor}15`,
                                                                color: order.statusColor
                                                            }}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className={styles.action}>
                                                        <button
                                                            className={styles.viewBtn}
                                                            onClick={() => setSelectedOrder(order)}
                                                        >
                                                            Détails <ChevronRight size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.section>
                        )}

                        {activeTab === 'orders' && selectedOrder && (
                            <motion.section
                                key="order-detail"
                                className={styles.section}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <button className={styles.backBtn} onClick={() => setSelectedOrder(null)}>
                                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Retour aux commandes
                                </button>
                                <div className={styles.orderDetailHeader}>
                                    <h2>Commande {selectedOrder.id}</h2>
                                    <span
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: `${selectedOrder.statusColor}15`, color: selectedOrder.statusColor }}
                                    >
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className={styles.orderCards}>
                                    <div className={styles.detailCard}>
                                        <h3>Informations</h3>
                                        <p><strong>Date :</strong> {selectedOrder.date}</p>
                                        <p><strong>Total :</strong> {selectedOrder.total.toLocaleString()} CFA</p>
                                        <p><strong>Paiement :</strong> Carte Bancaire (Stripe)</p>
                                    </div>
                                    <div className={styles.detailCard}>
                                        <h3>Livraison</h3>
                                        <p>Expédié via Colissimo</p>
                                        <p>Numéro de suivi : 6A123456789</p>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {activeTab === 'profile' && (
                            <motion.section
                                key="profile"
                                className={styles.section}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className={styles.sectionHeader}>
                                    <h2>Mon Profil Personnel</h2>
                                </div>
                                <div className={styles.profileContent}>
                                    <div className={styles.profileAvatar}>
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || 'Profil'} />
                                        ) : (
                                            <User size={40} />
                                        )}
                                    </div>
                                    <div className={styles.profileInfo}>
                                        <div className={styles.infoGroup}>
                                            <label>Nom complet</label>
                                            <p>{user.displayName || 'Non renseigné'}</p>
                                        </div>
                                        <div className={styles.infoGroup}>
                                            <label>Email</label>
                                            <p>{user.email}</p>
                                        </div>
                                        <div className={styles.infoGroup}>
                                            <label>Membre depuis</label>
                                            <p>{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('fr-FR') : 'Date inconnue'}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
