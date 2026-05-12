"use client";

import { useState } from "react";
import styles from "../products/products.module.css";
import adminStyles from "../admin.module.css";
import { 
    Users, 
    Mail, 
    Calendar, 
    MoreVertical,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCustomers() {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    // Placeholder data for now - could be fetched from Firestore 'users' collection
    const [customers] = useState([
        { id: 1, name: "Moussa Diop", email: "moussa@example.com", joinDate: "12 Mai 2024", orders: 5 },
        { id: 2, name: "Fatou Sow", email: "fatou@example.com", joinDate: "10 Mai 2024", orders: 2 },
        { id: 3, name: "Ibrahima Fall", email: "ibrahima@example.com", joinDate: "08 Mai 2024", orders: 12 },
        { id: 4, name: "Awa Ndiaye", email: "awa@example.com", joinDate: "05 Mai 2024", orders: 0 },
    ]);

    return (
        <div className={styles.productPage}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Gestion des Clients</h1>
                    <p>{customers.length} clients enregistrés</p>
                </div>
            </header>

            <div className={styles.tableContainer}>
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
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className={styles.productName}>{customer.name}</span>
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
                                    <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{customer.orders} achats</span>
                                </td>
                                <td>
                                    <div style={{ position: 'relative' }}>
                                        <button 
                                            className={styles.actionBtn} 
                                            style={{ backgroundColor: '#f5f5f5', color: '#666' }}
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
                                                    <button style={{ color: '#d32f2f' }} onClick={() => alert(`Supprimer ${customer.name}`)}>
                                                        Supprimer
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
            </div>
        </div>
    );
}
