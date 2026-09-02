"use client";

import styles from "./cgv.module.css";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function CGVPage() {
    return (
        <main className={styles.pageContainer}>
            <header className={styles.hero}>
                <motion.h1 {...fadeIn}>Livraison & Conditions Générales de Vente</motion.h1>
                <motion.p {...fadeIn} transition={{ delay: 0.1 }}>
                    Retrouvez ici toutes les informations relatives aux commandes, livraisons à Dakar et nos garanties fraîcheur.
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
                        <Truck size={20} style={{ color: 'var(--primary-green)' }} /> 1. Service de Livraison à Dakar
                    </span>
                </h2>
                <p>
                    Nous livrons vos paniers de fruits frais et jus naturels directement à votre domicile ou bureau à Dakar et sa banlieue.
                </p>
                <ul>
                    <li><strong>Zones desservies :</strong> Hann Maristes, Point E, Plateau, Almadies, Mermoz, Fann, Yoff, Ouakam, Liberté, Parcelles Assainies et Guédiawaye.</li>
                    <li><strong>Délais :</strong> Toute commande passée avant 12h00 est livrée le jour même entre 14h00 et 20h00. Les commandes passées l'après-midi sont livrées le lendemain matin.</li>
                    <li><strong>Tarifs :</strong> La livraison est facturée à un tarif forfaitaire de 1 500 CFA. Elle est gratuite pour toute commande d'un montant supérieur ou égal à 15 000 CFA.</li>
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
                        <RefreshCw size={20} style={{ color: 'var(--primary-green)' }} /> 2. Politique de Retour et Remboursement
                    </span>
                </h2>
                <p>
                    S'agissant de produits frais (fruits périssables et jus pressés à froid sans conservateurs), la qualité est notre priorité absolue :
                </p>
                <ul>
                    <li><strong>Contrôle à la réception :</strong> Nous vous prions de vérifier l'état de vos fruits lors de la livraison en présence du livreur.</li>
                    <li><strong>Remplacement immédiat :</strong> En cas de produit endommagé ou non conforme, le livreur le récupère et nous procédons à son remplacement gratuit ou à son remboursement immédiat.</li>
                    <li><strong>Réclamations :</strong> Toute réclamation ultérieure doit être formulée par téléphone ou WhatsApp dans un délai de 6 heures suivant la livraison pour être prise en compte.</li>
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
                        <CreditCard size={20} style={{ color: 'var(--primary-green)' }} /> 3. Moyens de Paiement Acceptés
                    </span>
                </h2>
                <p>
                    Afin de faciliter vos transactions, nous mettons à votre disposition plusieurs moyens de paiement sécurisés :
                </p>
                <ul>
                    <li><strong>Paiement en espèces :</strong> Directement auprès du livreur à la réception de votre commande.</li>
                    <li><strong>Paiement Mobile (Wave ou Orange Money) :</strong> Transfert direct au numéro de la boutique lors de la confirmation ou à la livraison.</li>
                </ul>
            </motion.section>

            <motion.section 
                className={styles.section}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h2>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle' }}>
                        <ShieldCheck size={20} style={{ color: 'var(--primary-green)' }} /> 4. Engagement Qualité & Origine
                    </span>
                </h2>
                <p>
                    Fresh Fruit s'engage à sélectionner exclusivement des fruits de premier choix, issus d'une agriculture locale et raisonnée au Sénégal. Nos jus sont pressés le matin même de votre livraison pour conserver toutes leurs qualités nutritionnelles.
                </p>
            </motion.section>

            <footer className={styles.lastUpdated}>
                Dernière mise à jour : Juin 2026 • Fresh Fruit Sénégal
            </footer>
        </main>
    );
}
