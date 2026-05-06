"use client";

import styles from './Hero.module.css';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.decorativeBg}></div>
            <div className={`container ${styles.heroContainer}`}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Fresh Fruit <br />
                        Le meilleur de la <br className={styles.mobileBr} />
                        <span className={styles.highlight}>nature</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Découvrez une sélection rigoureuse de fruits de saison mûris à point 
                        et des jus de fruits pressés 100% naturels. La fraîcheur et le goût 
                        authentique pour votre bien-être au quotidien.
                    </motion.p>
                    <motion.div
                        className={styles.cta}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    >
                        <Link href="/shop" className="btn btn-primary">
                            Commander maintenant <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className={styles.imageContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <div className={styles.mainImageWrapper}>
                        <img
                            src="/hero-fruit.jpg"
                            alt="Fruits Frais cueillis"
                            className={styles.actualImage}
                        />
                        <div className={styles.imageOverlay}></div>
                        <div className={styles.imageBadge}>
                            <span>100% Naturel & Bio</span>
                        </div>
                    </div>
                    <div className={styles.secondaryImageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600"
                            alt="Jus de Fruit Frais"
                            className={styles.actualImage}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
