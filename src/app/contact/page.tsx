"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './Contact.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('Information produit');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    
    const [showHours, setShowHours] = useState(false);
    const [todayName, setTodayName] = useState("");
    const [openingHours, setOpeningHours] = useState<Record<string, string>>({
        Lundi: "10h - 20h",
        Mardi: "10h - 20h",
        Mercredi: "10h - 20h",
        Jeudi: "10h - 20h",
        Vendredi: "10h - 20h",
        Samedi: "10h - 20h",
        Dimanche: "11h - 19h"
    });

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "general");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().openingHours) {
                    setOpeningHours(docSnap.data().openingHours);
                }
            } catch (error) {
                console.error("Error fetching opening hours for contact page:", error);
            }
        };
        fetchSettings();

        // Determine today's name in French
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const dayIndex = new Date().getDay();
        setTodayName(days[dayIndex]);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowHours(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !message) {
            setErrorMsg("Veuillez remplir tous les champs obligatoires.");
            setStatus('error');
            return;
        }

        setStatus('submitting');
        setErrorMsg('');

        try {
            // 1. Enregistrer dans Firestore
            await addDoc(collection(db, 'messages'), {
                name,
                phone,
                subject,
                message,
                createdAt: serverTimestamp(),
                read: false
            });

            const htmlContent = `
                <div style="background-color: #f8fafc; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);">
                        <div style="height: 6px; background-color: #2E7D32;"></div>
                        <div style="padding: 30px 24px;">
                            <div style="margin-bottom: 20px;">
                                <span style="font-size: 11px; font-weight: 800; color: #E65100; text-transform: uppercase; letter-spacing: 1.5px;">🍊 Fresh Fruit Admin</span>
                            </div>
                            
                            <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; letter-spacing: -0.02em; line-height: 1.3;">Nouveau message de contact</h1>
                            <p style="font-size: 13px; color: #64748b; margin: 0 0 24px 0;">Vous avez reçu une soumission via le formulaire de contact.</p>
                            
                            <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-bottom: 20px;">
                                <div style="margin-bottom: 14px;">
                                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">Nom complet</div>
                                    <div style="font-size: 14px; color: #0f172a; font-weight: 700;">${name}</div>
                                </div>
                                <div style="margin-bottom: 14px;">
                                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">Numéro de téléphone</div>
                                    <div style="font-size: 14px; color: #2E7D32; font-weight: 700;">
                                        <a href="tel:${phone}" style="color: #2E7D32; text-decoration: none;">${phone}</a>
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">Sujet</div>
                                    <div style="font-size: 14px; color: #0f172a; font-weight: 700;">${subject}</div>
                                </div>
                            </div>
                            
                            <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-bottom: 24px;">
                                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">Message du client</div>
                                <div style="background-color: #fafafa; border-left: 4px solid #E65100; padding: 14px 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.6; font-style: italic; white-space: pre-wrap;">${message.trim()}</div>
                            </div>
                            
                            <div style="text-align: left; margin-bottom: 10px;">
                                <a href="https://wa.me/${(() => {
                                    let cleaned = phone.replace(/\D/g, "");
                                    if (cleaned.startsWith("00")) cleaned = cleaned.substring(2);
                                    if (cleaned.length === 9 && (cleaned.startsWith("77") || cleaned.startsWith("78") || cleaned.startsWith("76") || cleaned.startsWith("70") || cleaned.startsWith("75"))) {
                                        cleaned = "221" + cleaned;
                                    }
                                    return cleaned;
                                })()}?text=Bonjour%20${encodeURIComponent(name)},%20concernant%20votre%20message%20"${encodeURIComponent(subject)}"%20:%20" target="_blank" style="background-color: #2E7D32; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);">
                                    Répondre sur WhatsApp
                                </a>
                            </div>
                        </div>
                        
                        <div style="background-color: #f8fafc; padding: 18px 24px; border-top: 1px solid #f1f5f9; text-align: center;">
                            <p style="font-size: 10px; color: #94a3b8; margin: 0; line-height: 1.4;">Cet e-mail est une notification d'administration automatique.<br>Ne répondez pas directement à cet e-mail.</p>
                        </div>
                    </div>
                </div>
            `;

            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "bahmouhamedalamine@gmail.com";

            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: adminEmail,
                    subject: `✉️ Nouveau message de contact : ${subject} (${name})`,
                    htmlContent: htmlContent
                })
            });

            // 3. Succès
            setStatus('success');
            setName('');
            setPhone('');
            setMessage('');
        } catch (error: any) {
            console.error("Error submitting contact form:", error);
            setErrorMsg("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
            setStatus('error');
        }
    };

    return (
        <div className={`container ${styles.contactPage}`}>
            <motion.header
                className={styles.header}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className={styles.title}>Contactez-nous</h1>
                <p className={styles.subtitle}>Une question ? Un projet ? Notre équipe à Dakar est à votre écoute.</p>
            </motion.header>

            <div className={styles.layout}>
                <motion.div
                    className={styles.formSection}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {status === 'success' && (
                        <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '1rem', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                            <CheckCircle size={20} /> Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                        </div>
                    )}
                    {status === 'error' && (
                        <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: '12px', fontWeight: 600, marginBottom: '1.5rem' }}>
                            {errorMsg}
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Nom complet</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    placeholder="Votre nom" 
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required 
                                    disabled={status === 'submitting'}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Numéro de téléphone</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    placeholder="Ex: 77 123 45 67" 
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required 
                                    disabled={status === 'submitting'}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="subject">Sujet</label>
                            <select 
                                id="subject"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                disabled={status === 'submitting'}
                            >
                                <option>Information produit</option>
                                <option>Suivi de commande</option>
                                <option>Livraison & Paniers</option>
                                <option>Autre</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message" 
                                rows={6} 
                                placeholder="Comment pouvons-nous vous aider ?" 
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                                disabled={status === 'submitting'}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                            {status === 'submitting' ? (
                                <>Envoi en cours... <Loader2 className="animate-spin" size={18} /></>
                            ) : (
                                <>Envoyer le message <Send size={18} /></>
                            )}
                        </button>
                    </form>
                </motion.div>

                <motion.div
                    className={styles.infoSection}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className={styles.infoCard}>
                        <h3>Nos Coordonnées</h3>
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <div className={styles.iconBox}>
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className={styles.infoLabel}>Adresse</p>
                                    <p>Hann Maristes, Dakar, Sénégal</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.iconBox}>
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className={styles.infoLabel}>Téléphone</p>
                                    <p>+33 7 53 13 65 28</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.iconBox}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className={styles.infoLabel}>Email</p>
                                    <p>contact@fresh-fruit.fr</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.dropdownContainer} ref={dropdownRef}>
                        <div className={styles.hoursCard} onClick={() => setShowHours(!showHours)}>
                            <div className={styles.dropdownTrigger}>
                                <div className={styles.iconBox} style={{ background: 'rgba(46, 125, 50, 0.05)', color: 'var(--primary-green)', margin: 0 }}>
                                    <Clock size={20} />
                                </div>
                                <div className={styles.dropdownTriggerText}>
                                    <h3>Horaires d'Ouverture</h3>
                                    <p>
                                        {todayName ? `Aujourd'hui : ${openingHours[todayName] || 'Fermé'}` : 'Cliquez pour voir les horaires'}
                                    </p>
                                </div>
                                <ChevronDown 
                                    size={20} 
                                    className={`${styles.chevronIcon} ${showHours ? styles.chevronOpen : ''}`} 
                                />
                            </div>
                        </div>
                        
                        <AnimatePresence>
                            {showHours && (
                                <motion.div
                                    className={styles.dropdownMenu}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    {Object.entries(openingHours).map(([day, hours]) => {
                                        const isToday = day === todayName;
                                        return (
                                            <div 
                                                key={day} 
                                                className={`${styles.dayRow} ${isToday ? styles.todayRow : ''}`}
                                            >
                                                <span className={styles.dayName}>
                                                    {day}
                                                    {isToday && (
                                                        <span className={styles.todayBadge}>Auj.</span>
                                                    )}
                                                </span>
                                                <span className={styles.dayHours}>{hours}</span>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className={styles.mapContainer}>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2418020.087170402!2d-19.87070934374999!3d14.738427800000009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec10d00717f1b23%3A0x56c88e2d060adb8d!2sFresh%20Fruit%20Maristes!5e1!3m2!1sfr!2sfr!4v1780588946600!5m2!1sfr!2sfr" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, minHeight: '300px', display: 'block' }} 
                            allowFullScreen={true}
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
