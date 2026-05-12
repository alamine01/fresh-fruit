"use client";

import { useState, useEffect } from "react";
import styles from "../products/products.module.css";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { 
    Save, 
    Store, 
    Bell, 
    Shield, 
    Globe,
    Phone,
    MapPin,
    Loader2,
    CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        storeName: "Fresh Fruit",
        email: "contact@fresh-fruit.sn",
        phone: "+221 33 824 00 00",
        address: "Point E, Dakar, Sénégal",
        notifications: true,
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "general");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as any);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des paramètres:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "general"), settings);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert("Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.productPage}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Paramètres</h1>
                    <p>Configurez les informations générales de votre boutique.</p>
                </div>
                <button 
                    className="btn btn-primary" 
                    style={{ gap: '0.5rem', minWidth: '150px' }}
                    onClick={handleSave}
                    disabled={saving || loading}
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {saving ? "Sauvegarde..." : "Enregistrer"}
                </button>
            </header>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ background: '#E8F5E9', color: '#2E7D32', padding: '1rem', borderRadius: '15px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <CheckCircle size={20} /> Paramètres mis à jour avec succès !
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div style={{ padding: '10rem', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary-green)', margin: '0 auto' }} />
                    <p style={{ marginTop: '1rem', color: '#666' }}>Chargement des réglages...</p>
                </div>
            ) : (
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
        )}
        </div>
    );
}
