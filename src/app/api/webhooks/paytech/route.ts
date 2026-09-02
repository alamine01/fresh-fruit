import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("PayTech IPN Webhook Received:", body);

        // Verification de l'événement et du statut du paiement (PayTech IPN payload)
        const { ref_command, type_event } = body;

        if (ref_command && (type_event === "sale_complete" || type_event === "payment_success")) {
            const orderRef = doc(db, "orders", ref_command);
            await updateDoc(orderRef, {
                paymentStatus: "Payé",
                updatedAt: new Date().toISOString()
            });
            console.log(`Commande ${ref_command} mise à jour avec le statut 'Payé'.`);
        }

        return NextResponse.json({ status: "success" });
    } catch (error: any) {
        console.error("Erreur Webhook PayTech:", error);
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
