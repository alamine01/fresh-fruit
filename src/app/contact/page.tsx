"use client";

import styles from './Contact.module.css';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
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
                    <form className={styles.form}>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Nom complet</label>
                                <input type="text" id="name" placeholder="Votre nom" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="votre@email.com" required />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="subject">Sujet</label>
                            <select id="subject">
                                <option>Information produit</option>
                                <option>Suivi de commande</option>
                                <option>Livraison & Paniers</option>
                                <option>Autre</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea id="message" rows={6} placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Envoyer le message <Send size={18} />
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
                                    <p>Point E, Dakar, Sénégal</p>
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

                    <div className={styles.infoCard}>
                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3>Horaires d'Ouverture</h3>
                                <p>Mar - Sam : 10h00 - 19h00</p>
                                <p>Lun & Dim : Fermé</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.mapContainer}>
                    <div className={styles.mapPlaceholder}>
                        <p>Retrouvez-nous au Point E, Dakar</p>
                    </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
