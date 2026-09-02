"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { 
    LayoutDashboard, 
    ShoppingBasket, 
    Users, 
    Settings, 
    LogOut,
    Apple,
    ShoppingBag,
    Loader2,
    Mail,
    Phone,
    ShieldAlert,
    KeyRound,
    Send,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, secondaryAuth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    // State for 2FA
    const [is2faVerified, setIs2faVerified] = useState<boolean>(false);
    const [method, setMethod] = useState<"email" | "sms">("email");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [otpCode, setOtpCode] = useState<string>("");
    const [generatedCode, setGeneratedCode] = useState<string>("");
    const [countdown, setCountdown] = useState<number | null>(null);
    const [cooldown, setCooldown] = useState<number>(0);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [confirmationResult, setConfirmationResult] = useState<any>(null);

    // Sidebar collapse state
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const collapsed = localStorage.getItem("admin_sidebar_collapsed");
            if (collapsed === "true") {
                setIsSidebarCollapsed(true);
            }
        }
    }, []);

    const toggleSidebar = () => {
        const newValue = !isSidebarCollapsed;
        setIsSidebarCollapsed(newValue);
        localStorage.setItem("admin_sidebar_collapsed", String(newValue));
    };

    // Verify admin role
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/account/login");
            } else {
                const knownAdmins = [
                    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase(),
                    "bahmouhamedalamine@gmail.com",
                    "contact@fresh-fruit.sn"
                ].filter(Boolean);

                const userEmail = user.email?.toLowerCase();
                const isDirectAdmin = userEmail && knownAdmins.includes(userEmail);

                if (isDirectAdmin) {
                    setIsAdmin(true);
                } else {
                    const checkAdminRole = async () => {
                        try {
                            const userDocRef = doc(db, "users", user.uid);
                            const userDocSnap = await getDoc(userDocRef);
                            if (userDocSnap.exists() && userDocSnap.data().role === "admin") {
                                setIsAdmin(true);
                            } else {
                                setIsAdmin(false);
                                router.push("/");
                            }
                        } catch (error) {
                            console.error("Error checking admin role:", error);
                            setIsAdmin(false);
                            router.push("/");
                        }
                    };
                    checkAdminRole();
                }
            }
        }
    }, [user, loading, router]);

    // Check if 2FA is already verified (lasts 30 minutes, renewed on navigation)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const verifiedAtStr = localStorage.getItem("admin_2fa_verified_at");
            if (verifiedAtStr) {
                const verifiedAt = parseInt(verifiedAtStr, 10);
                const now = Date.now();
                const thirtyMinutes = 30 * 60 * 1000;
                if (now - verifiedAt < thirtyMinutes) {
                    setIs2faVerified(true);
                    // Renew sliding session timestamp
                    localStorage.setItem("admin_2fa_verified_at", now.toString());
                } else {
                    localStorage.removeItem("admin_2fa_verified_at");
                    sessionStorage.removeItem("admin_2fa_verified");
                }
            } else {
                // Fallback to sessionStorage for backward compatibility
                const verified = sessionStorage.getItem("admin_2fa_verified");
                if (verified === "true") {
                    setIs2faVerified(true);
                    localStorage.setItem("admin_2fa_verified_at", Date.now().toString());
                }
            }
        }
    }, [pathname]);

    // Set phone number if available on user object
    useEffect(() => {
        if (user && user.phoneNumber) {
            setPhoneNumber(user.phoneNumber);
        }
    }, [user]);

    // Countdown for code validity
    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setGeneratedCode("");
            setError("Le code de sécurité a expiré. Veuillez en générer un nouveau.");
        }
    }, [countdown]);

    // Cooldown for resending
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSendCode = async () => {
        if (!user) return;
        setIsSending(true);
        setError("");
        setMessage("");

        // Generate a 6-digit random code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        setCountdown(300); // 5 minutes

        if (method === "email") {
            if (!user.email) {
                setError("Aucune adresse email trouvée pour ce compte.");
                setIsSending(false);
                return;
            }

            try {
                const htmlContent = `
                    <div style="background-color: #f4f6f8; padding: 30px 15px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">
                        <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border-top: 6px solid #2E7D32;">
                            <div style="padding: 35px 25px; text-align: center;">
                                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #E65100; margin-bottom: 12px;">
                                    🔒 Sécurité Administrateur
                                </div>
                                <h1 style="font-size: 20px; font-weight: 800; color: #1e293b; margin: 0 0 16px 0; line-height: 1.2;">
                                    Code de double authentification
                                </h1>
                                <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0 0 24px 0;">
                                    Un essai de connexion à votre espace d'administration a été détecté. Saisissez le code temporaire ci-dessous pour valider votre authentification :
                                </p>
                                
                                <div style="background-color: #f8fafc; padding: 16px 24px; border-radius: 12px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #E65100; display: inline-block; border: 1px dashed #e2e8f0; margin-bottom: 20px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                                    ${code}
                                </div>
                                
                                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                                    Ce code est à usage unique et expire dans 5 minutes.
                                </p>
                            </div>
                            
                            <div style="background-color: #f8fafc; padding: 18px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                                Fresh Fruit Sécurité • Ne partagez jamais ce code.
                            </div>
                        </div>
                    </div>
                `;

                const res = await fetch("/api/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: user.email,
                        subject: "🔒 Code de double authentification - Admin Fresh Fruit",
                        htmlContent: htmlContent
                    })
                });

                if (res.ok) {
                    setMessage(`Un code de sécurité à 6 chiffres a été envoyé à ${user.email}.`);
                    setCooldown(60);
                } else {
                    throw new Error("SMTP dispatch failed");
                }
            } catch (e) {
                setError("Impossible d'envoyer l'email de validation. Veuillez réessayer.");
            } finally {
                setIsSending(false);
            }
        } else {
            // SMS Method - Firebase OTP
            const targetPhone = phoneNumber.trim();
            if (!targetPhone) {
                setError("Veuillez saisir un numéro de téléphone valide.");
                setIsSending(false);
                return;
            }

            // Format phone number
            let formattedPhone = targetPhone.replace(/\s/g, '');
            if (!formattedPhone.startsWith('+')) {
                if (formattedPhone.startsWith('0')) {
                    formattedPhone = '+221' + formattedPhone.substring(1);
                } else {
                    formattedPhone = '+221' + formattedPhone;
                }
            }

            try {
                if (!secondaryAuth) {
                    throw new Error("Le service d'authentification secondaire n'est pas disponible.");
                }

                // Enable testing mode on localhost to bypass recaptcha issues and avoid auth/invalid-app-credential
                if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
                    secondaryAuth.settings.appVerificationDisabledForTesting = true;
                }

                // Clean recaptcha container
                const container = document.getElementById('recaptcha-container-admin');
                if (container) {
                    container.innerHTML = "";
                }

                if ((window as any).adminRecaptchaVerifier) {
                    try {
                        (window as any).adminRecaptchaVerifier.clear();
                    } catch (e) {
                        console.log("Error clearing recaptcha:", e);
                    }
                    (window as any).adminRecaptchaVerifier = null;
                }

                (window as any).adminRecaptchaVerifier = new RecaptchaVerifier(secondaryAuth, 'recaptcha-container-admin', {
                    size: 'invisible'
                });

                const result = await signInWithPhoneNumber(secondaryAuth, formattedPhone, (window as any).adminRecaptchaVerifier);
                setConfirmationResult(result);
                setGeneratedCode("FIREBASE_OTP"); // Placeholder to trigger code entry component
                setCountdown(300); // 5 minutes
                setMessage(`Un code de sécurité a été envoyé par SMS à ${formattedPhone}.`);
                setCooldown(60);
            } catch (err: any) {
                console.error("Firebase SMS dispatch error:", err);
                setError(`Impossible d'envoyer le SMS. ${err.message || err.code || err}`);
                if ((window as any).adminRecaptchaVerifier) {
                    try {
                        (window as any).adminRecaptchaVerifier.clear();
                    } catch (e) {}
                    (window as any).adminRecaptchaVerifier = null;
                }
            } finally {
                setIsSending(false);
            }
        }
    };

    const handleVerify = async () => {
        setError("");
        setMessage("");

        if (method === "email") {
            if (!generatedCode || countdown === 0) {
                setError("Aucun code actif. Veuillez demander un nouveau code.");
                return;
            }
            if (otpCode.trim() === generatedCode) {
                localStorage.setItem("admin_2fa_verified_at", Date.now().toString());
                sessionStorage.setItem("admin_2fa_verified", "true");
                setIs2faVerified(true);
            } else {
                setError("Code incorrect. Veuillez réessayer.");
            }
        } else {
            // SMS Method - Firebase OTP verification
            if (!confirmationResult) {
                setError("Aucune session d'envoi de SMS active. Veuillez renvoyer le code.");
                return;
            }
            if (!otpCode.trim()) {
                setError("Veuillez saisir le code reçu par SMS.");
                return;
            }

            setIsSending(true);
            try {
                const res = await confirmationResult.confirm(otpCode.trim());
                if (res.user) {
                    localStorage.setItem("admin_2fa_verified_at", Date.now().toString());
                    sessionStorage.setItem("admin_2fa_verified", "true");
                    setIs2faVerified(true);
                } else {
                    throw new Error("Validation échouée.");
                }
            } catch (err: any) {
                console.error("Firebase OTP Verification error:", err);
                setError("Code de confirmation incorrect ou expiré.");
            } finally {
                setIsSending(false);
            }
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: ShoppingBasket, label: "Produits", href: "/admin/products" },
        { icon: ShoppingBag, label: "Commandes", href: "/admin/orders" },
        { icon: Users, label: "Clients", href: "/admin/customers" },
        { icon: Mail, label: "Messages", href: "/admin/messages" },
        { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    ];

    if (loading || isAdmin === null) {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8f9fa", gap: "1rem" }}>
                <Loader2 className="animate-spin" size={40} style={{ color: "var(--primary-green)" }} />
                <p style={{ color: "#666", fontWeight: 600 }}>Vérification des droits d'accès...</p>
            </div>
        );
    }

    if (!isAdmin) return null;

    // Render 2FA screen if not verified
    if (!is2faVerified) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 0%, rgba(230, 81, 0, 0.05) 90%)",
                padding: "2rem",
                fontFamily: "var(--font-inter), sans-serif"
            }}>
                <div style={{
                    background: "white",
                    padding: "3rem 2.5rem",
                    borderRadius: "24px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(46, 125, 50, 0.1)",
                    width: "100%",
                    maxWidth: "480px",
                    textAlign: "center"
                }}>
                    <div style={{
                        width: "64px",
                        height: "64px",
                        background: "rgba(46, 125, 50, 0.08)",
                        color: "var(--primary-green)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem"
                    }}>
                        <ShieldAlert size={32} />
                    </div>

                    <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem", color: "#1a1a1a" }}>
                        Double Authentification
                    </h1>
                    <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "2rem", lineHeight: "1.5" }}>
                        L'accès à l'espace d'administration est sécurisé et requiert un code de validation à usage unique.
                    </p>

                    {/* Method Selector */}
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                        <button 
                            onClick={() => { setMethod("email"); setError(""); setMessage(""); }}
                            style={{
                                flex: 1,
                                padding: "0.8rem",
                                borderRadius: "12px",
                                border: method === "email" ? "2px solid var(--primary-green)" : "1px solid #ddd",
                                background: method === "email" ? "rgba(46, 125, 50, 0.04)" : "white",
                                color: method === "email" ? "var(--primary-green)" : "#555",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            <Mail size={16} /> Email
                        </button>
                        <button 
                            onClick={() => { setMethod("sms"); setError(""); setMessage(""); }}
                            style={{
                                flex: 1,
                                padding: "0.8rem",
                                borderRadius: "12px",
                                border: method === "sms" ? "2px solid var(--primary-green)" : "1px solid #ddd",
                                background: method === "sms" ? "rgba(46, 125, 50, 0.04)" : "white",
                                color: method === "sms" ? "var(--primary-green)" : "#555",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            <Phone size={16} /> SMS
                        </button>
                    </div>

                    {/* Method Input / Details */}
                    {method === "email" ? (
                        <div style={{
                            background: "#f8f9fa",
                            padding: "1rem",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            color: "#555",
                            marginBottom: "1.5rem",
                            border: "1px solid #eee",
                            textAlign: "left"
                        }}>
                            Code envoyé à l'adresse : <strong style={{ color: "#111" }}>{user?.email}</strong>
                        </div>
                    ) : (
                        <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#444", display: "block", marginBottom: "0.5rem" }}>
                                Numéro de téléphone
                            </label>
                            <input 
                                type="tel" 
                                placeholder="+221 XX XXX XX XX" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.8rem 1rem",
                                    borderRadius: "12px",
                                    border: "1px solid #ddd",
                                    fontSize: "0.9rem",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>
                    )}

                    {/* Send Button / Cooldown */}
                    <button
                        onClick={handleSendCode}
                        disabled={isSending || cooldown > 0}
                        style={{
                            width: "100%",
                            padding: "1rem",
                            borderRadius: "12px",
                            background: cooldown > 0 ? "#e2e8f0" : "var(--primary-orange)",
                            color: cooldown > 0 ? "#718096" : "white",
                            fontWeight: 700,
                            border: "none",
                            fontSize: "0.95rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.6rem",
                            cursor: (isSending || cooldown > 0) ? "default" : "pointer",
                            marginBottom: "1.5rem",
                            boxShadow: cooldown > 0 ? "none" : "0 4px 12px rgba(230, 81, 0, 0.2)"
                        }}
                    >
                        {isSending ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Send size={18} />
                        )}
                        {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : "Envoyer le code de sécurité"}
                    </button>

                    {/* Messages */}
                    {error && (
                        <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "0.8rem", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem", textAlign: "left" }}>
                            {error}
                        </div>
                    )}
                    {message && (
                        <div style={{ background: "#E8F5E9", color: "#2E7D32", padding: "0.8rem", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem", textAlign: "left" }}>
                            {message}
                        </div>
                    )}

                    {/* OTP Entry */}
                    {generatedCode && (
                        <div style={{
                            borderTop: "1px solid #eee",
                            paddingTop: "1.5rem",
                            marginTop: "1rem",
                            textAlign: "left"
                        }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#444", display: "block", marginBottom: "0.5rem" }}>
                                Entrez le code à 6 chiffres
                            </label>
                            <div style={{ display: "flex", gap: "0.8rem" }}>
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                    style={{
                                        flex: 1,
                                        padding: "0.8rem 1rem",
                                        borderRadius: "12px",
                                        border: "1px solid #ddd",
                                        fontSize: "1.1rem",
                                        fontWeight: 800,
                                        letterSpacing: "4px",
                                        textAlign: "center",
                                        outline: "none"
                                    }}
                                />
                                <button
                                    onClick={handleVerify}
                                    style={{
                                        padding: "0 1.5rem",
                                        borderRadius: "12px",
                                        background: "var(--primary-green)",
                                        color: "white",
                                        fontWeight: 700,
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    Valider
                                </button>
                            </div>
                            {countdown !== null && countdown > 0 && (
                                <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.5rem" }}>
                                    Le code expire dans : <strong>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}</strong>
                                </p>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: "2rem" }}>
                        <Link href="/" style={{ fontSize: "0.85rem", color: "#666", textDecoration: "underline" }}>
                            Retourner sur la boutique
                        </Link>
                    </div>
                    {/* Conteneur invisible pour le reCAPTCHA Firebase */}
                    <div id="recaptcha-container-admin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminLayout}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <div className={styles.logo} style={{ marginBottom: 0 }}>
                    <Apple size={24} /> <span>Fresh Admin</span>
                </div>
                <button 
                    onClick={() => {
                        localStorage.removeItem("admin_2fa_verified_at");
                        sessionStorage.removeItem("admin_2fa_verified");
                        router.push("/");
                    }}
                    className={styles.navLink} 
                    style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}
                >
                    <LogOut size={20} />
                </button>
            </header>

            <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.sidebarCollapsed : ""}`}>
                {/* Bouton de réduction flottant */}
                <button 
                    onClick={toggleSidebar}
                    className={styles.toggleBtn}
                    title={isSidebarCollapsed ? "Agrandir le menu" : "Réduire le menu"}
                >
                    {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                <div className={styles.logo}>
                    <Apple /> <span>Fresh Admin</span>
                </div>
                
                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ""}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button 
                        onClick={() => {
                            localStorage.removeItem("admin_2fa_verified_at");
                            sessionStorage.removeItem("admin_2fa_verified");
                            router.push("/");
                        }}
                        className={styles.navLink}
                        style={{
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: 'inherit',
                            fontFamily: 'inherit',
                            fontSize: 'inherit'
                        }}
                    >
                        <LogOut size={20} />
                        <span>Quitter l'admin</span>
                    </button>
                </div>
            </aside>

            <main className={`${styles.mainContent} ${isSidebarCollapsed ? styles.mainContentCollapsed : ""}`}>
                {children}
            </main>

            {/* Bottom Nav for Mobile */}
            <nav className={styles.bottomNav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`${styles.bottomNavLink} ${isActive ? styles.bottomNavActive : ""}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
