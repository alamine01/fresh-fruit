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
    ShoppingBag,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import styles from './Account.module.css';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/account/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const q = query(
                        collection(db, "orders"),
                        where("userId", "==", user.uid)
                    );
                    const querySnapshot = await getDocs(q);
                    const ordersList = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        
                        // Formater la date proprement
                        let formattedDate = "Récemment";
                        if (data.createdAt) {
                            const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                            formattedDate = dateObj.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            });
                        }

                        // Couleur du badge de statut
                        let statusColor = "#FF9800"; // En attente / orange
                        if (data.status === "Livré") statusColor = "#4CAF50"; // Vert
                        if (data.status === "Annulé") statusColor = "#F44336"; // Rouge
                        if (data.status === "En cours") statusColor = "#2196F3"; // Bleu

                        return {
                            id: doc.id,
                            date: formattedDate,
                            total: Number(data.total || 0).toLocaleString() + " CFA",
                            status: data.status || "En attente",
                            statusColor: statusColor,
                            items: data.items || [],
                            paymentMethod: data.paymentMethod || "cod",
                            paymentStatus: data.paymentStatus || "En attente",
                            customer: data.customer || {}
                        };
                    });
                    
                    // Trier par date/id décroissante (plus récent d'abord)
                    ordersList.sort((a, b) => b.id.localeCompare(a.id));
                    
                    setUserOrders(ordersList);
                } catch (error) {
                    console.error("Erreur lors de la récupération des commandes :", error);
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }
    }, [user]);

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

                            {loadingOrders ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem' }}>
                                    <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-green)' }} />
                                    <p style={{ marginTop: '1rem', color: '#666' }}>Chargement de vos commandes...</p>
                                </div>
                            ) : userOrders.length > 0 ? (
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
                                            {userOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td><span className={styles.orderId}>{order.id}</span></td>
                                                    <td>{order.date}</td>
                                                    <td><span className={styles.total}>{order.total}</span></td>
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
                            ) : (
                                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fcfcfc', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                                    <ShoppingBag size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
                                    <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Vous n'avez pas encore passé de commande.</p>
                                    <Link href="/shop" className="btn btn-primary">
                                        Commencer mes achats
                                    </Link>
                                </div>
                            )}
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
                                    <p style={{ margin: '0.5rem 0' }}><strong>Total :</strong> {selectedOrder.total}</p>
                                    <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <CreditCard size={14} /> 
                                        {selectedOrder.paymentMethod === "stripe" ? "Payé par Carte Bancaire" : 
                                         selectedOrder.paymentMethod === "wave" ? "Payé par Wave" : 
                                         selectedOrder.paymentMethod === "om" ? "Payé par Orange Money" : 
                                         "Paiement à la livraison"}
                                        <span style={{ fontSize: '0.85rem', color: selectedOrder.paymentStatus === 'Payé' ? 'var(--primary-green)' : '#FF9800', fontWeight: 'bold', marginLeft: '5px' }}>
                                            ({selectedOrder.paymentStatus === 'Payé' ? 'Payé' : 'Non payé'})
                                        </span>
                                    </p>
                                </div>
                                <div style={{ background: '#fcfcfc', padding: '2rem', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Truck size={18} /> Livraison</h3>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Destinataire :</strong> {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Adresse :</strong> {selectedOrder.customer?.address || "Non renseignée"}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Quartier :</strong> {selectedOrder.customer?.neighborhood ? selectedOrder.customer.neighborhood.toUpperCase() : "Non renseigné"}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Téléphone :</strong> {selectedOrder.customer?.phone || "Non renseigné"}</p>
                                </div>
                            </div>

                            {/* Liste des articles commandés */}
                            <div style={{ marginTop: '2.5rem', background: '#fcfcfc', padding: '2rem', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Articles commandés</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid #eee' : 'none' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }} />}
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{item.name}</h4>
                                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>{item.quantity} x {Number(item.price || 0).toLocaleString()} CFA</p>
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toLocaleString()} CFA</span>
                                        </div>
                                    ))}
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
