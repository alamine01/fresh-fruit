"use client";

import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import styles from "../Checkout.module.css";

function SuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const [isCod, setIsCod] = useState(false);

    useEffect(() => {
        clearCart();

        const confirmPayment = async () => {
            if (orderId) {
                try {
                    const orderRef = doc(db, "orders", orderId);
                    const orderSnap = await getDoc(orderRef);
                    if (orderSnap.exists()) {
                        const orderData = orderSnap.data();
                        if (orderData.paymentMethod === "cod") {
                            setIsCod(true);
                            console.log("Paiement à la livraison : laissé en statut Non payé.");
                        } else {
                            await updateDoc(orderRef, {
                                paymentStatus: "Payé"
                            });
                            console.log("Commande mise à jour en Payé avec succès !");
                        }
                    }
                } catch (error) {
                    console.error("Erreur lors de la mise à jour du statut de paiement:", error);
                }
            }
        };

        confirmPayment();
    }, [orderId, clearCart]);

    return (
        <div className={`container ${styles.empty}`}>
            <span style={{ fontSize: '4rem' }}>{isCod ? "📦" : "🎉"}</span>
            <h1>Merci pour votre commande !</h1>
            <p>
                {isCod 
                    ? "Votre commande a été enregistrée avec succès. Vous réglerez le paiement en espèces lors de la livraison."
                    : "Votre paiement a été accepté. Vous recevrez un email de confirmation sous peu."
                }
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/shop" className="btn btn-primary">
                    Continuer mes achats
                </Link>
                <Link href="/account" className="btn btn-secondary">
                    Voir mes commandes
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                Chargement...
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
