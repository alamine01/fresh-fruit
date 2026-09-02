"use client";

import styles from "./About.module.css";
import { Truck, Store, Heart, Users, CheckCircle, Sprout, Apple } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function AboutPage() {
    return (
        <main className={styles.aboutPage}>
            {/* Hero Section simple */}
            <section className={styles.aboutHero}>
                <div className="container">
                    <motion.span className={styles.heroBadge} {...fadeIn}>Qui sommes-nous ?</motion.span>
                    <motion.h1 {...fadeIn} transition={{ delay: 0.1 }}>Notre Vision, Votre Santé</motion.h1>
                    <motion.p {...fadeIn} transition={{ delay: 0.2 }}>
                        Fresh Fruit est né d'une passion pour les produits de qualité et d'un engagement profond pour le développement local au Sénégal.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="container">
                <div className={styles.missionGrid}>
                    <motion.div className={styles.missionText} {...fadeIn}>
                        <span className={styles.badge}>Notre Mission</span>
                        <h2>Soutenir la Jeunesse Agricole</h2>
                        <p>
                            Notre mission est double : offrir aux habitants de Dakar l'accès aux meilleurs fruits du pays, et booster la production de nos jeunes agriculteurs locaux. 
                        </p>
                        <p>
                            En travaillant directement avec des fournisseurs locaux, nous garantissons des revenus justes aux producteurs et une fraîcheur inégalée à nos clients.
                        </p>
                        <div className={styles.points}>
                            <div className={styles.point}>
                                <Users size={20} />
                                <span>Accompagnement de nombreux jeunes exploitants</span>
                            </div>
                            <div className={styles.point}>
                                <Heart size={20} />
                                <span>Valorisation du terroir sénégalais</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className={styles.missionImage} {...fadeIn} transition={{ delay: 0.2 }}>
                        <img src="/jeunes-agriculteurs.png" alt="Jeunes agriculteurs sénégalais" />
                    </motion.div>
                </div>
            </section>

            {/* Process Section */}
            <section className={styles.processSection}>
                <div className="container">
                    <motion.div className={styles.sectionHeader} {...fadeIn}>
                        <span className={styles.badge}>Notre Métier</span>
                        <h2>De l'Arbre à la Table</h2>
                        <p>Découvrez les étapes clés qui garantissent une fraîcheur exceptionnelle au quotidien.</p>
                    </motion.div>

                    <div className={styles.processGrid}>
                        <motion.div 
                            className={styles.processCard} 
                            {...fadeIn} 
                            transition={{ delay: 0.1 }}
                        >
                            <div className={styles.stepNumber}>1</div>
                            <div className={styles.processImageWrapper}>
                                <img src="/process-step-1.png" alt="Sélection & Partenariats" className={styles.processImage} />
                            </div>
                            <div className={styles.processContent}>
                                <div className={styles.processIcon}>
                                    <Sprout size={22} />
                                </div>
                                <h3>Sélection & Partenariats</h3>
                                <p>Nous tissons des liens de confiance avec des jeunes agriculteurs locaux passionnés à travers tout le Sénégal.</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={styles.processCard} 
                            {...fadeIn} 
                            transition={{ delay: 0.2 }}
                        >
                            <div className={styles.stepNumber}>2</div>
                            <div className={styles.processImageWrapper}>
                                <img src="/process-step-2.png" alt="Récolte Responsable" className={styles.processImage} />
                            </div>
                            <div className={styles.processContent}>
                                <div className={styles.processIcon}>
                                    <Apple size={22} />
                                </div>
                                <h3>Récolte Responsable</h3>
                                <p>Les fruits sont récoltés manuellement, à pleine maturité, pour préserver toutes leurs vitamines et saveurs originelles.</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={styles.processCard} 
                            {...fadeIn} 
                            transition={{ delay: 0.3 }}
                        >
                            <div className={styles.stepNumber}>3</div>
                            <div className={styles.processImageWrapper}>
                                <img src="/process-step-3.png" alt="Contrôle & Tri" className={styles.processImage} />
                            </div>
                            <div className={styles.processContent}>
                                <div className={styles.processIcon}>
                                    <CheckCircle size={22} />
                                </div>
                                <h3>Contrôle & Tri</h3>
                                <p>Chaque arrivage est inspecté minutieusement et calibré dans nos ateliers de tri pour ne garder que le meilleur.</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={styles.processCard} 
                            {...fadeIn} 
                            transition={{ delay: 0.4 }}
                        >
                            <div className={styles.stepNumber}>4</div>
                            <div className={styles.processImageWrapper}>
                                <img src="/process-step-4.png" alt="Livraison Express" className={styles.processImage} />
                            </div>
                            <div className={styles.processContent}>
                                <div className={styles.processIcon}>
                                    <Truck size={22} />
                                </div>
                                <h3>Livraison Express</h3>
                                <p>Acheminés dans le respect de la chaîne du froid, vos fruits vous sont livrés à Dakar en moins de 24 heures.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Infrastructure Section */}
            <section className={styles.infraBg}>
                <div className="container">
                    <motion.div className={styles.sectionHeader} {...fadeIn}>
                        <h2>Notre Présence à Dakar</h2>
                        <p>Une logistique maîtrisée pour une fraîcheur irréprochable.</p>
                    </motion.div>
                    
                    <div className={styles.infraGrid}>
                        <motion.div className={styles.infraCard} {...fadeIn} transition={{ delay: 0.1 }}>
                            <div className={styles.iconCircle}><Store size={28} /></div>
                            <h3>3 Magasins Physiques</h3>
                            <p>Venez découvrir nos produits dans nos points de vente à travers la ville.</p>
                        </motion.div>
                        <motion.div className={styles.infraCard} {...fadeIn} transition={{ delay: 0.2 }}>
                            <div className={styles.iconCircle}><Truck size={28} /></div>
                            <h3>Entrepôts & Logistique</h3>
                            <p>Des installations modernes pour stocker et acheminer vos fruits dans les meilleures conditions.</p>
                        </motion.div>
                        <motion.div className={styles.infraCard} {...fadeIn} transition={{ delay: 0.3 }}>
                            <div className={styles.iconCircle}><CheckCircle size={28} /></div>
                            <h3>Qualité Garantie</h3>
                            <p>Chaque arrivage est contrôlé rigoureusement par nos experts qualité.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
