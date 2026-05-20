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
    Loader2,
    Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCustomers() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [customers, setCustomers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // 1. Écouter les commandes en temps réel
        const unsubOrders = onSnapshot(collection(db, "orders"), (ordersSnap) => {
            const ordersData = ordersSnap.docs.map(doc => ({
                id: doc.id,
                userId: doc.data().userId
            }));
            setOrders(ordersData);
        }, (error) => {
            console.error("Erreur commandes Firestore :", error);
        });

        // 2. Écouter les clients en temps réel
        const unsubUsers = onSnapshot(query(collection(db, "users"), orderBy("createdAt", "desc")), (usersSnap) => {
            const usersData = usersSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                joinDate: doc.data().createdAt?.toDate ? 
                          doc.data().createdAt.toDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 
                          "Date inconnue"
            }));
            setCustomers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Erreur clients Firestore :", error);
            setLoading(false);
        });

        return () => {
            unsubOrders();
            unsubUsers();
        };
    }, []);

    const getCustomerOrderCount = (customerId: string) => {
        return orders.filter(order => order.userId === customerId).length;
    };

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
                                                    {customer.email ? (
                                                        <><Mail size={12} /> {customer.email}</>
                                                    ) : (
                                                        <><Phone size={12} /> {customer.phone || "Pas de contact"}</>
                                                    )}
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
                                        <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{getCustomerOrderCount(customer.id)} achats</span>
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
