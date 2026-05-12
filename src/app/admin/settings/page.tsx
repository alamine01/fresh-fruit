"use client";

import { useState } from "react";
import styles from "../products/products.module.css";
import { 
    Save, 
    Store, 
    Bell, 
    Shield, 
    Globe,
    Phone,
    MapPin
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        storeName: "Fresh Fruit",
        email: "contact@fresh-fruit.sn",
        phone: "+221 33 824 00 00",
        address: "Point E, Dakar, Sénégal",
        notifications: true,
        maintenanceMode: false
    });

    return (
        <div className={styles.productPage}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Paramètres</h1>
                    <p>Configurez les informations générales de votre boutique.</p>
                </div>
                <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Save size={20} /> Enregistrer
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <motion.section 
                    style={{ background: 'white', padding: '2.5rem', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <Store size={22} color="var(--primary-green)" /> Informations Boutique
                    </h3>
                    
                    <div className={styles.formGroup}>
                        <label>Nom de la boutique</label>
                        <input type="text" value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Téléphone de contact</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input type="text" style={{ paddingLeft: '3rem' }} value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Adresse physique</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#999' }} />
                            <textarea style={{ paddingLeft: '3rem' }} rows={3} value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
                        </div>
                    </div>
                </motion.section>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <motion.section 
                        style={{ background: 'white', padding: '2.5rem', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <Bell size={22} color="#E65100" /> Notifications
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontWeight: 700 }}>Alertes de nouvelles commandes</p>
                                <p style={{ fontSize: '0.85rem', color: '#888' }}>Recevoir un email à chaque nouvelle vente.</p>
                            </div>
                            <input type="checkbox" checked={settings.notifications} onChange={e => setSettings({...settings, notifications: e.target.checked})} />
                        </div>
                    </motion.section>

                    <motion.section 
                        style={{ background: 'white', padding: '2.5rem', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <Shield size={22} color="#D32F2F" /> Sécurité
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontWeight: 700 }}>Mode Maintenance</p>
                                <p style={{ fontSize: '0.85rem', color: '#888' }}>Rendre le site inaccessible temporairement.</p>
                            </div>
                            <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})} />
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
}
