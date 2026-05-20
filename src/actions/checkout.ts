"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

interface CartItem {
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export async function createCheckoutSession(items: CartItem[]) {
    const headersList = await headers();
    const origin = headersList.get("origin");

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map((item) => ({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.name,
                        images: [item.image],
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
            shipping_address_collection: {
                allowed_countries: ["FR", "SN"],
            },
        });

        return { sessionId: session.id, url: session.url };
    } catch (error: any) {
        throw new Error(error.message);
    }
}

import { db } from "@/lib/firebase";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { sendAdminOrderAlert } from "@/lib/email";

export async function createLocalOrder(orderData: any) {
    try {
        const orderToSave = {
            ...orderData,
            status: "En attente",
            createdAt: serverTimestamp(),
            customerName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
            itemsSummary: orderData.items.map((it: any) => `${it.quantity}x ${it.name}`).join(", ")
        };

        let orderNumber = "";
        let docId = "";

        await runTransaction(db, async (transaction) => {
            const counterRef = doc(db, "counters", "orders");
            const counterSnap = await transaction.get(counterRef);
            
            let nextSeq = 100; // Départ séquentiel à 100 (simple comme O'Tacos)
            if (counterSnap.exists()) {
                const currentSeq = counterSnap.data().currentSeq;
                if (typeof currentSeq === 'number') {
                    nextSeq = currentSeq + 1;
                }
            }
            
            const newOrderRef = doc(collection(db, "orders"));
            docId = newOrderRef.id;
            orderNumber = `#${nextSeq}`;
            
            // Mettre à jour le compteur atomiquement
            transaction.set(counterRef, { currentSeq: nextSeq }, { merge: true });
            
            // Enregistrer la commande
            transaction.set(newOrderRef, {
                ...orderToSave,
                orderNumber: orderNumber
            });
        });
        
        // Envoyer l'alerte email avec le nouveau numéro
        await sendAdminOrderAlert({
            ...orderData,
            id: docId,
            orderNumber: orderNumber
        });

        return { success: true, orderId: docId };
    } catch (error: any) {
        console.error("Erreur création commande:", error);
        return { success: false, error: error.message };
    }
}
