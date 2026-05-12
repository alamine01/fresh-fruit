"use client";

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, LogIn, ArrowRight, Phone, MessageSquare, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './Login.module.css';

function LoginContent() {
    const { loginWithGoogle, loginWithEmail, loginWithPhone, saveUserToFirestore, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || 'account';
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [showOtp, setShowOtp] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [otp, setOtp] = useState("");
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        phone: ""
    });

    useEffect(() => {
        if (user) {
            router.push('/' + redirectPath);
        }
    }, [user, router, redirectPath]);

    if (user) return null;

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            await loginWithGoogle();
            router.push('/' + redirectPath);
        } catch (error) {
            console.error("Google login error:", error);
            setError("Impossible de se connecter avec Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await loginWithEmail(formData.email, formData.password);
            router.push('/' + redirectPath);
        } catch (err: any) {
            console.error("Email login error:", err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("Email ou mot de passe incorrect.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Trop de tentatives. Veuillez réessayer plus tard.");
            } else {
                setError("Une erreur est survenue lors de la connexion.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let phoneNumber = formData.phone;
            if (!phoneNumber.startsWith('+')) {
                phoneNumber = '+221' + phoneNumber.replace(/\s/g, '');
            }

            const result = await loginWithPhone(phoneNumber, 'recaptcha-container');
            setConfirmationResult(result);
            setShowOtp(true);
        } catch (err: any) {
            console.error("Phone login error:", err);
            setError(`Erreur: ${err.code || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await confirmationResult.confirm(otp);
            // S'assurer que l'utilisateur est dans Firestore
            await saveUserToFirestore(res.user);
            router.push('/' + redirectPath);
        } catch (err: any) {
            console.error("OTP verification error:", err);
            setError("Code de confirmation incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`container ${styles.loginPage}`}>
            <motion.div
                className={styles.loginCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ position: 'relative' }}
            >
                <Link href="/" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                    <ChevronLeft size={18} /> Retour
                </Link>
                <header className={styles.header}>
                    <div className={styles.logoCircle}>
                        <User size={32} />
                    </div>
                    <h1>Mon Espace Client</h1>
                    <p>Connectez-vous pour suivre vos commandes et gérer votre profil.</p>
                </header>

                <div className={styles.socialAuth}>
                    <button
                        className={styles.googleBtn}
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg viewBox="0 0 48 48" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                        </svg>
                        Continuer avec Google
                    </button>
                </div>

                <div className={styles.divider}>
                    <span>ou avec</span>
                </div>

                <div className={styles.methodToggle}>
                    <button 
                        className={authMethod === 'email' ? styles.activeMethod : ''} 
                        onClick={() => { setAuthMethod('email'); setShowOtp(false); setError(""); }}
                    >
                        Email
                    </button>
                    <button 
                        className={authMethod === 'phone' ? styles.activeMethod : ''} 
                        onClick={() => { setAuthMethod('phone'); setError(""); }}
                    >
                        Téléphone
                    </button>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <div id="recaptcha-container"></div>

                <AnimatePresence mode="wait">
                    {authMethod === 'email' ? (
                        <motion.form 
                            key="email-form"
                            className={styles.form} 
                            onSubmit={handleEmailLogin}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
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
                                {loading ? "Connexion..." : "Se connecter"} <LogIn size={18} />
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="phone-auth"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {!showOtp ? (
                                <form className={styles.form} onSubmit={handlePhoneLogin}>
                                    <div className={styles.formGroup}>
                                        <label>Numéro de téléphone</label>
                                        <div className={styles.inputWrapper}>
                                            <Phone size={18} />
                                            <input
                                                type="tel"
                                                placeholder="+221 77 000 00 00"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                        {loading ? "Envoi..." : "Recevoir le code"} <ArrowRight size={18} />
                                    </button>
                                </form>
                            ) : (
                                <form className={styles.form} onSubmit={handleVerifyOtp}>
                                    <div className={styles.formGroup}>
                                        <label>Code de confirmation (SMS)</label>
                                        <div className={styles.inputWrapper}>
                                            <MessageSquare size={18} />
                                            <input
                                                type="text"
                                                placeholder="123456"
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                        {loading ? "Vérification..." : "Vérifier le code"} <LogIn size={18} />
                                    </button>
                                    <button 
                                        type="button" 
                                        style={{ width: '100%', background: 'none', border: 'none', color: '#666', marginTop: '1rem', fontSize: '0.85rem' }}
                                        onClick={() => setShowOtp(false)}
                                    >
                                        Changer de numéro
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <footer className={styles.footer}>
                    <p>Pas encore de compte ?</p>
                    <Link href={`/account/register${searchParams.toString() ? '?' + searchParams.toString() : ''}`}>
                        Créer un compte <ArrowRight size={16} />
                    </Link>
                </footer>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>Chargement...</div>}>
            <LoginContent />
        </Suspense>
    );
}
