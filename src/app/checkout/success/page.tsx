"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import styles from "../Checkout.module.css";

export default function SuccessPage() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, []); // On ne l'exécute qu'une seule fois au montage

    return (
        <div className={`container ${styles.empty}`}>
            <span style={{ fontSize: '4rem' }}>🎉</span>
            <h1>Merci pour votre commande !</h1>
            <p>Votre paiement a été accepté. Vous recevrez un email de confirmation sous peu.</p>
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
