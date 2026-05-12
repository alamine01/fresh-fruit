"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                            <Facebook size={18} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                            <Instagram size={18} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                            <Twitter size={18} />
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
                    <div className={styles.contactItem}>
                        <Clock size={16} />
                        <div>
                            <p>Lun - Sam : 10h - 20h</p>
                            <p>Dimanche : 11h - 19h</p>
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
