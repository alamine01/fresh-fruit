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

export async function createLocalOrder(orderData: any) {
    // Dans une application réelle, on enregistrerait ici la commande dans Firebase
    // Pour cet exemple, nous simulons la réussite
    console.log("Nouvelle commande locale reçue:", orderData);
    
    return { success: true, orderId: "LOC-" + Math.random().toString(36).substr(2, 9) };
}
