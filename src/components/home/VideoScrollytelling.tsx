"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Sparkles, ShieldCheck, ShoppingBag, Truck, Play } from 'lucide-react';
import styles from './VideoScrollytelling.module.css';

interface StepData {
    id: number;
    badge: string;
    icon: any;
    title: string;
    subtitle: string;
    highlight: string;
    cta?: {
        text: string;
        href: string;
    };
}

const STEPS: StepData[] = [
    {
        id: 1,
        badge: "01 / 04 • Découverte",
        icon: Sparkles,
        title: "L'Authenticité au Cœur de Dakar",
        subtitle: "Bienvenue dans nos boutiques Fresh Fruit. Une immersion au cœur des meilleures récoltes locales du Sénégal.",
        highlight: "Fruits frais cueillis à maturité"
    },
    {
        id: 2,
        badge: "02 / 04 • Engagement",
        icon: ShieldCheck,
        title: "Hygiène & Qualité Irréprochables",
        subtitle: "Nos équipes sélectionnent et préparent chaque fruit selon des critères sanitaires et d'hygiène les plus stricts.",
        highlight: "Contrôle qualité à chaque étape"
    },
    {
        id: 3,
        badge: "03 / 04 • Savoir-faire",
        icon: ShoppingBag,
        title: "100% Pur Fruit & Fait Maison",
        subtitle: "Des jus frais, des nectars gourmands et des produits artisanaux préparés chaque jour, sans conservateurs.",
        highlight: "Zéro sucre ajouté, 100% naturel"
    },
    {
        id: 4,
        badge: "04 / 04 • Expérience",
        icon: Truck,
        title: "Du Verger Directement chez Vous",
        subtitle: "Profitez de la livraison rapide à Dakar ou récupérez vos jus frais directement dans notre boutique aux Maristes.",
        highlight: "Livraison express en 45 minutes",
        cta: {
            text: "Explorer la Boutique",
            href: "/shop"
        }
    }
];

export default function VideoScrollytelling() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [duration, setDuration] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Handle Video Metadata
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsVideoLoaded(true);
            // Pause video so scroll controls it
            videoRef.current.pause();
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Sync scroll progress to video currentTime smoothly
        const unsubscribe = scrollYProgress.on("change", (latestProgress) => {
            if (video && duration > 0) {
                const targetTime = latestProgress * duration;
                if (!isNaN(targetTime) && Math.abs(video.currentTime - targetTime) > 0.05) {
                    video.currentTime = targetTime;
                }
            }

            // Determine active step (0, 1, 2, 3)
            let stepIndex = 0;
            if (latestProgress < 0.25) {
                stepIndex = 0;
            } else if (latestProgress < 0.50) {
                stepIndex = 1;
            } else if (latestProgress < 0.75) {
                stepIndex = 2;
            } else {
                stepIndex = 3;
            }

            setActiveStepIndex(stepIndex);
        });

        return () => unsubscribe();
    }, [scrollYProgress, duration]);

    const activeStep = STEPS[activeStepIndex];
    const IconComponent = activeStep.icon;

    return (
        <section ref={containerRef} className={styles.scrollySection}>
            <div className={styles.stickyWrapper}>
                {/* Background Video Frame */}
                <div className={styles.videoContainer}>
                    <video
                        ref={videoRef}
                        playsInline
                        muted
                        preload="auto"
                        onLoadedMetadata={handleLoadedMetadata}
                        className={styles.bgVideo}
                        poster="/hero-fruit.jpg"
                    >
                        <source 
                            src="https://firebasestorage.googleapis.com/v0/b/fresh-fruit-3f64d.firebasestorage.app/o/fresh%20fruit.mp4?alt=media&token=35536189-830c-4e80-a92a-8e606f7d7a95" 
                            type="video/mp4" 
                        />
                    </video>
                    
                    {/* Dark gradient overlay for contrast */}
                    <div className={styles.videoOverlay} />
                </div>

                {/* Header Hint / Indicator */}
                <div className={styles.topBar}>
                    <span className={styles.sectionTag}>
                        <Play size={12} className={styles.playPulse} /> Séquence Interactive
                    </span>
                    <span className={styles.scrollHint}>
                        Défilez vers le bas pour découvrir
                    </span>
                </div>

                {/* Main Floating Card Container */}
                <div className={styles.contentOverlay}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep.id}
                            initial={{ opacity: 0, y: 25, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={styles.storyCard}
                        >
                            <div className={styles.badgeRow}>
                                <span className={styles.stepBadge}>
                                    {activeStep.badge}
                                </span>
                                <div className={styles.iconCircle}>
                                    <IconComponent size={18} />
                                </div>
                            </div>

                            <h3 className={styles.cardTitle}>{activeStep.title}</h3>
                            <p className={styles.cardSubtitle}>{activeStep.subtitle}</p>

                            <div className={styles.highlightPill}>
                                <span className={styles.dotIndicator} />
                                <span>{activeStep.highlight}</span>
                            </div>

                            {activeStep.cta && (
                                <motion.div 
                                    className={styles.ctaWrapper}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <Link href={activeStep.cta.href} className={styles.ctaBtn}>
                                        <span>{activeStep.cta.text}</span>
                                        <ChevronRight size={18} />
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Step Progress Indicators */}
                <div className={styles.progressContainer}>
                    {STEPS.map((step, idx) => {
                        const isActive = idx === activeStepIndex;
                        const isPast = idx < activeStepIndex;
                        return (
                            <div
                                key={step.id}
                                className={`${styles.progressDotWrapper} ${isActive ? styles.dotActive : ''} ${isPast ? styles.dotPast : ''}`}
                            >
                                <div className={styles.progressDot} />
                                <span className={styles.dotLabel}>0{step.id}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
