"use client";

import { useState, useEffect } from "react";
import styles from "../products/products.module.css";
import adminStyles from "../admin.module.css";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { 
    Users, 
    Mail, 
    Calendar, 
    MoreVertical,
    Search,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCustomers() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                joinDate: doc.data().createdAt?.toDate ? 
                          doc.data().createdAt.toDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 
                          "Date inconnue"
            }));
            setCustomers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Erreur Firestore:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className={styles.productPage}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Gestion des Clients</h1>
                    <p>{customers.length} clients enregistrés</p>
                </div>
            </header>

            <div className={styles.tableContainer}>
                {loading ? (
                    <div style={{ padding: '5rem', textAlign: 'center' }}>
                        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-green)', margin: '0 auto' }} />
                        <p style={{ marginTop: '1rem', color: '#666' }}>Chargement de la base clients...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div style={{ padding: '5rem', textAlign: 'center', color: '#888' }}>
                        <Users size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>Aucun client inscrit pour le moment.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Date d'inscription</th>
                                <th>Commandes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, i) => (
                                <motion.tr 
                                    key={customer.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <td>
                                        <div className={styles.productInfo}>
                                            <div style={{ width: 45, height: 45, borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)', fontWeight: 800 }}>
                                                {(customer.name || customer.displayName || "C").charAt(0)}
                                            </div>
                                            <div>
                                                <span className={styles.productName}>{customer.name || customer.displayName || "Client Anonyme"}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Mail size={12} /> {customer.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '0.9rem' }}>
                                            <Calendar size={14} /> {customer.joinDate}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{customer.orderCount || 0} achats</span>
                                    </td>
                                    <td>
                                        <div style={{ position: 'relative' }}>
                                            <button 
                                                className={styles.actionBtn} 
                                                onClick={() => setOpenMenu(openMenu === customer.id ? null : customer.id)}
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            <AnimatePresence>
                                                {openMenu === customer.id && (
                                                    <motion.div 
                                                        className={styles.dropdown}
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    >
                                                        <button onClick={() => alert(`Détails de ${customer.name}`)}>
                                                            Voir détails
                                                        </button>
                                                        <button onClick={() => window.location.href = `mailto:${customer.email}`}>
                                                            Envoyer Email
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
