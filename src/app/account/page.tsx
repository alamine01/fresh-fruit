"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, 
    User, 
    LogOut, 
    ChevronRight, 
    Clock, 
    CheckCircle, 
    Truck,
    Apple,
    ArrowLeft,
    CreditCard,
    ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import styles from './Account.module.css';

const orders = [
    { id: 'ORD-1234', date: '10 Fév 2026', total: '53.50', status: 'Livré', statusColor: '#4CAF50' },
    { id: 'ORD-5678', date: '15 Fév 2026', total: '12.00', status: 'En préparation', statusColor: '#FF9800' }
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
        return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Apple size={40} color="var(--primary-green)" />
            </motion.div>
        </div>;
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className={styles.accountPage}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <Link href="/" className={styles.logo} style={{ marginBottom: 0 }}>
                    <Apple size={24} /> <span>Fresh Fruit</span>
                </Link>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <LogOut size={20} />
                </button>
            </header>

            <aside className={styles.sidebar}>
                <Link href="/" className={styles.logo}>
                    <Apple /> <span>Fresh Fruit</span>
                </Link>
                
                <nav className={styles.nav}>
                    <button
                        className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
                    >
                        <ShoppingBag size={20} />
                        <span>Mes Commandes</span>
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} />
                        <span>Mon Profil</span>
                    </button>
                </nav>

                <button className={`${styles.navItem} ${styles.logout}`} onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Mon Espace Client</h1>
                    <p style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Bonjour, <span style={{ fontWeight: 700 }}>{user.displayName || user.email?.split('@')[0] || "Client"}</span> <CheckCircle size={18} color="var(--primary-green)" />
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'orders' && !selectedOrder && (
                        <motion.section
                            key="orders-list"
                            className={styles.section}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h2>Historique de vos commandes</h2>

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
                                                <td><span className={styles.orderId}>{order.id}</span></td>
                                                <td>{order.date}</td>
                                                <td><span className={styles.total}>{order.total} CFA</span></td>
                                                <td>
                                                    <span
                                                        className={styles.statusBadge}
                                                        style={{ backgroundColor: `${order.statusColor}15`, color: order.statusColor }}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button className={styles.viewBtn} onClick={() => setSelectedOrder(order)}>
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
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                        >
                            <button className={styles.viewBtn} onClick={() => setSelectedOrder(null)} style={{ marginBottom: '2rem' }}>
                                <ArrowLeft size={16} /> Retour à la liste
                            </button>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                <h2>Détails de la commande {selectedOrder.id}</h2>
                                <span className={styles.statusBadge} style={{ backgroundColor: `${selectedOrder.statusColor}15`, color: selectedOrder.statusColor }}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                <div style={{ background: '#fcfcfc', padding: '2rem', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={18} /> Infos générales</h3>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Date :</strong> {selectedOrder.date}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Total :</strong> {selectedOrder.total} CFA</p>
                                    <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '5px' }}><CreditCard size={14} /> Payé par Wave</p>
                                </div>
                                <div style={{ background: '#fcfcfc', padding: '2rem', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Truck size={18} /> Livraison</h3>
                                    <p style={{ margin: '0.5rem 0' }}>Expédition en cours</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Code de suivi :</strong> FF-SEN-0092</p>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {activeTab === 'profile' && (
                        <motion.section
                            key="profile"
                            className={styles.section}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h2>Mon Profil Personnel</h2>
                            <div className={styles.profileContent}>
                                <div className={styles.profileAvatar}>
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || 'Profil'} />
                                    ) : (
                                        <User size={48} />
                                    )}
                                </div>
                                <div className={styles.profileInfo}>
                                    <div className={styles.infoGroup}>
                                        <label>Nom Complet</label>
                                        <p>{user.displayName || "Non renseigné"}</p>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <label>Email / Contact</label>
                                        <p>{user.email || user.phoneNumber || "Non renseigné"}</p>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <label>Type de compte</label>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <CheckCircle size={16} color="var(--primary-green)" /> Client vérifié
                                        </p>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <label>Date d'inscription</label>
                                        <p>{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Nav for Mobile */}
            <nav className={styles.bottomNav}>
                <button 
                    className={`${styles.bottomNavLink} ${activeTab === 'orders' ? styles.bottomNavActive : ""}`}
                    onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
                >
                    <ShoppingBag size={20} />
                    <span>Commandes</span>
                </button>
                <button 
                    className={`${styles.bottomNavLink} ${activeTab === 'profile' ? styles.bottomNavActive : ""}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <User size={20} />
                    <span>Profil</span>
                </button>
                <button className={styles.bottomNavLink} onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Quitter</span>
                </button>
            </nav>
        </div>
    );
}
