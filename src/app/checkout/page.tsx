"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createCheckoutSession, createLocalOrder } from "@/actions/checkout";
import { createPayTechPayment } from "@/actions/paytech";
import styles from "./Checkout.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, User as UserIcon, CreditCard, Banknote, ChevronLeft, Lock, Truck, LogIn, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { cart, totalPrice, totalItems, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("wave");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        neighborhood: ""
    });
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const names = (user.displayName || "").split(" ");
            setFormData(prev => ({
                ...prev,
                firstName: names[0] || "",
                lastName: names.slice(1).join(" ") || "",
                phone: user.phoneNumber || prev.phone
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        
        // Validation simple
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.neighborhood) {
            alert("Veuillez remplir toutes les informations de livraison.");
            return;
        }

        setLoading(true);
        try {
            if (paymentMethod === "stripe") {
                const { url } = await createCheckoutSession(cart);
                if (url) {
                    window.location.href = url;
                }
            } else if (paymentMethod === "wave" || paymentMethod === "om") {
                // Paiement via PayTech (Wave / OM)
                // 1. Créer d'abord la commande en base avec le statut "Non payé"
                const localOrder = await createLocalOrder({
                    items: cart,
                    total: totalPrice,
                    customer: formData,
                    paymentMethod: paymentMethod, // 'wave' ou 'om'
                    paymentStatus: "Non payé",
                    userId: user?.uid || null
                });

                if (localOrder.success && localOrder.orderId) {
                    const result = await createPayTechPayment({
                        total: totalPrice,
                        orderId: localOrder.orderId,
                        customer: formData,
                        origin: window.location.origin
                    }, paymentMethod);
                    
                    if (result.success && result.redirect_url) {
                        clearCart();
                        window.location.href = result.redirect_url;
                    } else {
                        alert(result.message || "Erreur lors de la redirection vers PayTech.");
                    }
                } else {
                    alert("Erreur lors de l'enregistrement de la commande.");
                }
            } else {
                // Paiement à la livraison
                const result = await createLocalOrder({
                    items: cart,
                    total: totalPrice,
                    customer: formData,
                    paymentMethod: "cod",
                    paymentStatus: "Non payé",
                    userId: user?.uid || null
                });
                
                if (result.success) {
                    clearCart();
                    router.push("/checkout/success?order_id=" + result.orderId);
                }
            }
        } catch (error: any) {
            alert("Une erreur est survenue lors de l'initialisation de la commande.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <motion.div
                className={`container ${styles.empty}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>Votre panier est vide</h1>
                <p>Veuillez ajouter des produits avant de passer commande.</p>
                <Link href="/shop" className="btn btn-primary">
                    Retour à la boutique
                </Link>
            </motion.div>
        );
    }

    return (
        <div className={`container ${styles.checkoutPage}`}>
            <div className={styles.header}>
                <Link href="/shop" className={styles.backLink}>
                    <ChevronLeft size={20} /> Retour à la boutique
                </Link>
                <h1 className={styles.title}>Finaliser ma commande</h1>
            </div>

            <div className={styles.layout}>
                <div className={styles.mainContent}>
                    {/* Bannière d'identification optionnelle */}
                    {!user ? (
                        <div className={styles.authBanner}>
                            <div className={styles.authBannerIcon}>
                                <LogIn size={24} color="var(--primary-green)" />
                            </div>
                            <div className={styles.authBannerText}>
                                <h3>Déjà client ?</h3>
                                <p>Connectez-vous pour pré-remplir vos infos et suivre vos commandes.</p>
                            </div>
                            <Link href="/account/login?redirect=checkout" className={styles.authLink}>
                                Se connecter
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.authBanner} style={{ borderColor: 'var(--primary-green)', background: '#f0f9f1' }}>
                            <div className={styles.authBannerIcon}>
                                <CheckCircle size={24} color="var(--primary-green)" />
                            </div>
                            <div className={styles.authBannerText}>
                                <h3>Connecté en tant que {user.displayName || user.phoneNumber}</h3>
                                <p>Vos informations sont sécurisées et votre commande sera liée à votre profil.</p>
                            </div>
                        </div>
                    )}

                    {/* Informations de livraison */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <UserIcon size={20} /> Informations de livraison
                        </h2>
                        <div className={styles.formGroup}>
                            <div className={styles.formRow}>
                                <div className={styles.inputField}>
                                    <label>Prénom</label>
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        placeholder="Votre prénom"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className={styles.inputField}>
                                    <label>Nom</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        placeholder="Votre nom"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className={styles.inputField}>
                                <label>Téléphone (Sénégal)</label>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    placeholder="+221 ..."
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className={styles.inputField}>
                                <label>Quartier (Dakar)</label>
                                <select 
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Choisir un quartier</option>
                                    <option value="plateau">Dakar Plateau</option>
                                    <option value="pointe">Point E</option>
                                    <option value="mermoz">Mermoz</option>
                                    <option value="almadies">Almadies</option>
                                    <option value="ngor">Ngor</option>
                                    <option value="ouakam">Ouakam</option>
                                    <option value="liberte">Liberté</option>
                                    <option value="parcelles">Parcelles Assainies</option>
                                    <option value="pikine">Pikine</option>
                                    <option value="guediawaye">Guédiawaye</option>
                                </select>
                            </div>
                            <div className={styles.inputField}>
                                <label>Adresse précise / Indications</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    placeholder="Rue, Immeuble, Appartement..."
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mode de paiement */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <CreditCard size={20} /> Mode de paiement
                        </h2>
                        <div className={styles.paymentMethods}>
                            <div 
                                className={`${styles.paymentOption} ${paymentMethod === "wave" ? styles.selected : ""}`}
                                onClick={() => setPaymentMethod("wave")}
                            >
                                <input type="radio" checked={paymentMethod === "wave"} readOnly />
                                <div className={styles.paymentIcon}>
                                    <img src="/wave.webp" alt="Wave" className={styles.methodLogo} />
                                </div>
                                <div className={styles.paymentInfo}>
                                    <span>Wave</span>
                                    <span>Paiement instantané</span>
                                </div>
                            </div>

                            <div 
                                className={`${styles.paymentOption} ${paymentMethod === "om" ? styles.selected : ""}`}
                                onClick={() => setPaymentMethod("om")}
                            >
                                <input type="radio" checked={paymentMethod === "om"} readOnly />
                                <div className={styles.paymentIcon}>
                                    <img src="/orange-money.jpg" alt="Orange Money" className={styles.methodLogo} />
                                </div>
                                <div className={styles.paymentInfo}>
                                    <span>Orange Money</span>
                                    <span>Simple et rapide</span>
                                </div>
                            </div>
                            
                            <div 
                                className={`${styles.paymentOption} ${paymentMethod === "cod" ? styles.selected : ""}`}
                                onClick={() => setPaymentMethod("cod")}
                            >
                                <input type="radio" checked={paymentMethod === "cod"} readOnly />
                                <div className={styles.paymentIcon}>
                                    <Banknote size={24} />
                                </div>
                                <div className={styles.paymentInfo}>
                                    <span>Paiement à la livraison</span>
                                    <span>Cash à la réception</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Récapitulatif produits */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Votre commande</h2>
                        <div className={styles.itemsSection}>
                            {cart.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                                    <div className={styles.itemInfo}>
                                        <h3>{item.name}</h3>
                                        <p>{item.quantity} x {item.price.toLocaleString()} CFA</p>
                                    </div>
                                    <p className={styles.itemTotal}>{(item.price * item.quantity).toLocaleString()} CFA</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <motion.aside
                    className={styles.summary}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <h2>Résumé</h2>
                    <div className={styles.summaryRow}>
                        <span>Produits ({totalItems})</span>
                        <span>{totalPrice.toLocaleString()} CFA</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Livraison</span>
                        <span className={styles.free}>Gratuit</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                        <span>Total à payer</span>
                        <span>{totalPrice.toLocaleString()} CFA</span>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '2rem' }}
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? "Traitement..." : "Confirmer la commande"}
                    </button>

                    <p className={styles.secureInfo}>
                        {paymentMethod === "cod" ? (
                            <><Truck size={14} /> Livraison garantie sous 2h à Dakar</>
                        ) : (
                            <><Lock size={14} /> Paiement 100% sécurisé</>
                        )}
                    </p>
                </motion.aside>
            </div>
        </div>
    );
}
