"use client";

import styles from "./legal.module.css";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, Mail, Info } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function LegalPage() {
    return (
        <main className={styles.pageContainer}>
            <header className={styles.hero}>
                <motion.h1 {...fadeIn}>Mentions Légales</motion.h1>
                <motion.p {...fadeIn} transition={{ delay: 0.1 }}>
                    Informations réglementaires concernant l'éditeur, l'hébergeur et la protection des données personnelles de la boutique Fresh Fruit.
                </motion.p>
            </header>

            <motion.section 
                className={styles.section}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle' }}>
                        <Info size={20} style={{ color: 'var(--primary-green)' }} /> 1. Éditeur du Site
                    </span>
                </h2>
                <p>
                    Le site internet <strong>Fresh Fruit</strong> est édité par l'entreprise :
                </p>
                <ul>
                    <li><strong>Nom de l'entreprise :</strong> Fresh Fruit S.U.A.R.L.</li>
                    <li><strong>Siège social :</strong> Point E, Dakar, Sénégal</li>
                    <li><strong>Téléphone de contact :</strong> +221 33 824 00 00</li>
                    <li><strong>Adresse de courrier électronique :</strong> contact@fresh-fruit.sn</li>
                    <li><strong>Directeur de la publication :</strong> La Direction Fresh Fruit</li>
                </ul>
            </motion.section>

            <motion.section 
                className={styles.section}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle' }}>
                        <Scale size={20} style={{ color: 'var(--primary-green)' }} /> 2. Hébergement du Site
                    </span>
                </h2>
                <p>
                    Le site est hébergé de manière sécurisée auprès de :
                </p>
                <ul>
                    <li><strong>Hébergeur :</strong> Vercel Inc.</li>
                    <li><strong>Adresse :</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA</li>
                    <li><strong>Site Web :</strong> vercel.com</li>
                </ul>
            </motion.section>

            <motion.section 
                className={styles.section}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h2>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle' }}>
                        <ShieldCheck size={20} style={{ color: 'var(--primary-green)' }} /> 3. Propriété Intellectuelle
                    </span>
                </h2>
                <p>
                    L'ensemble des contenus présents sur ce site (textes, logos, photographies de fruits, t-shirts, illustrations graphiques et animations) sont la propriété exclusive de Fresh Fruit S.U.A.R.L. ou de ses partenaires.
                </p>
                <p>
                    Toute reproduction, distribution, modification ou adaptation de ces différents éléments, même partielle, est strictement interdite sans l'accord préalable écrit de la direction.
                </p>
            </motion.section>

            <motion.section 
                className={styles.section}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h2>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle' }}>
                        <Mail size={20} style={{ color: 'var(--primary-green)' }} /> 4. Protection des Données (RGPD)
                    </span>
                </h2>
                <p>
                    Fresh Fruit s'engage à préserver la confidentialité des données personnelles collectées (lors de la soumission du formulaire de contact ou du passage de commande) :
                </p>
                <ul>
                    <li><strong>Utilisation des données :</strong> Les informations recueillies (nom, téléphone, messages, adresses de livraison) sont uniquement utilisées pour le traitement de vos demandes d'informations et la livraison de vos paniers.</li>
                    <li><strong>Destinataires :</strong> Ces données ne sont jamais partagées, vendues ou cédées à des tiers. Elles sont destinées exclusivement à l'équipe interne de Fresh Fruit.</li>
                    <li><strong>Vos droits :</strong> Conformément à la législation sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données. Pour exercer ce droit, écrivez-nous à <a href="mailto:contact@fresh-fruit.sn" style={{ color: 'var(--primary-green)', textDecoration: 'underline' }}>contact@fresh-fruit.sn</a>.</li>
                </ul>
            </motion.section>

            <footer className={styles.lastUpdated}>
                Dernière mise à jour : Juin 2026 • Fresh Fruit Sénégal
            </footer>
        </main>
    );
}
