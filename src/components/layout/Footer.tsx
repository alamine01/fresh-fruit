"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, ExternalLink, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const TiktokIcon = ({ size = 18 }: { size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [openingHours, setOpeningHours] = useState<Record<string, string>>({
        Lundi: "10h - 20h",
        Mardi: "10h - 20h",
        Mercredi: "10h - 20h",
        Jeudi: "10h - 20h",
        Vendredi: "10h - 20h",
        Samedi: "10h - 20h",
        Dimanche: "11h - 19h"
    });
    const [isOpen, setIsOpen] = useState(false);
    const [todayName, setTodayName] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "general");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().openingHours) {
                    setOpeningHours(docSnap.data().openingHours);
                }
            } catch (error) {
                console.error("Error fetching opening hours for footer:", error);
            }
        };
        fetchSettings();

        // Determine today's name in French
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const dayIndex = new Date().getDay();
        setTodayName(days[dayIndex]);
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img src="/logo.png" alt="Fresh Fruit Logo" className={styles.logoImg} />
                        </Link>
                    </div>
                    <p className={styles.description}>
                        La fraîcheur de la nature directement chez vous.
                        Fruits de saison et jus naturels pour une vie pleine de vitalité.
                    </p>
                    <div className={styles.social}>
                        <a href="https://www.facebook.com/share/1DACRAg4wt/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                            <Facebook size={18} />
                        </a>
                        <a href="https://www.instagram.com/freshfruitsenegal?igsh=MTV3cTE1eDlyOTV5bQ==" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                            <Instagram size={18} />
                        </a>
                        <a href="https://www.tiktok.com/@fresh.fruits.mariste?_r=1&_t=ZN-96xILK25hyg" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="TikTok">
                            <TiktokIcon size={18} />
                        </a>
                    </div>
                </div>

                <div className={styles.linksGroup}>
                    <div className={styles.links}>
                        <h3>Explorer</h3>
                        <Link href="/shop" className={styles.link}>Boutique</Link>
                        <Link href="/about" className={styles.link}>À Propos</Link>
                        <Link href="/contact" className={styles.link}>Contact</Link>
                    </div>

                    <div className={styles.links}>
                        <h3>Aide</h3>
                        <Link href="/cgv" className={styles.link}>Livraison & Retours</Link>
                        <Link href="/legal" className={styles.link}>Mentions Légales</Link>
                    </div>
                </div>

                <div className={styles.contact}>
                    <h3>Nous trouver</h3>
                    <div className={styles.contactItem}>
                        <MapPin size={16} />
                        <span>Point E, Dakar, Sénégal</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Phone size={16} />
                        <span>+221 33 824 00 00</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Mail size={16} />
                        <span>contact@fresh-fruit.fr</span>
                    </div>
                    <div className={styles.contactItem} style={{ width: '100%' }}>
                        <div className={styles.dropdownContainer}>
                            <button 
                                className={styles.dropdownTrigger}
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                aria-expanded={isOpen}
                            >
                                <Clock size={16} />
                                <div className={styles.dropdownTriggerText}>
                                    <span>Horaires d'ouverture</span>
                                    <small style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                        {todayName ? `Aujourd'hui : ${openingHours[todayName] || 'Fermé'}` : 'Cliquez pour voir'}
                                    </small>
                                </div>
                                <ChevronDown 
                                    size={16} 
                                    className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ''}`} 
                                />
                            </button>

                            <AnimatePresence>
                                {isOpen && (
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
                                                        {isToday && <span className={styles.todayBadge}>Auj.</span>}
                                                    </span>
                                                    <span className={styles.dayHours}>{hours}</span>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={`container ${styles.bottomContainer}`}>
                    <p>&copy; {currentYear} Fresh Fruit. Fraîcheur garantie.</p>
                    <div className={styles.bottomLegal}>
                        <Link href="/legal">Vie privée</Link>
                        <span className={styles.divider}>•</span>
                        <Link href="/cgv">Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
