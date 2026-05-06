"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from '../login/Login.module.css';

export default function RegisterPage() {
    const { register, loginWithGoogle, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (user) {
            router.push('/account');
        }
    }, [user, router]);

    if (user) return null;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await register(formData.email, formData.password, formData.name);
            router.push('/account');
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            router.push('/account');
        } catch (err) {
            // Erreur gérée ou ignorée
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`container ${styles.loginPage}`}>
            <motion.div
                className={styles.loginCard}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <header className={styles.header}>
                    <div className={styles.logoCircle}>
                        <UserPlus size={32} />
                    </div>
                    <h1>Créer un compte</h1>
                    <p>Rejoignez la communauté Fresh Fruit et profitez d'un suivi personnalisé de vos commandes.</p>
                </header>

                <button
                    className={styles.googleBtn}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    S'inscrire avec Google
                </button>

                <div className={styles.divider}>
                    <span>ou avec vos coordonnées</span>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form className={styles.form} onSubmit={handleRegister}>
                    <div className={styles.formGroup}>
                        <label>Nom complet</label>
                        <div className={styles.inputWrapper}>
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Prénom Nom"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Mot de passe</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? "Création..." : "S'inscrire"} <UserPlus size={18} />
                    </button>
                </form>

                <footer className={styles.footer}>
                    <p>Déjà un compte ?</p>
                    <Link href="/account/login">
                        Se connecter <ArrowRight size={16} />
                    </Link>
                </footer>
            </motion.div>
        </div>
    );
}
