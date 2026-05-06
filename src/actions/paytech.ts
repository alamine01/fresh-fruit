"use server";

export async function createPayTechPayment(orderData: any) {
    const API_KEY = process.env.PAYTECH_API_KEY || "test_key";
    const API_SECRET = process.env.PAYTECH_API_SECRET || "test_secret";

    try {
        // Envoi de la requête à PayTech
        const response = await fetch("https://paytech.sn/api/payment/request-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "API_KEY": API_KEY,
                "API_SECRET": API_SECRET
            },
            body: JSON.stringify({
                item_name: "Commande Fresh Fruit",
                item_price: orderData.total,
                currency: "XOF",
                ref_command: orderData.orderId,
                command_name: "Paiement de la commande #" + orderData.orderId,
                env: "live",
                success_url: orderData.origin + "/checkout/success",
                cancel_url: orderData.origin + "/checkout/cancel",
                custom_field: JSON.stringify(orderData.customer)
            })
        });

        const result = await response.json();
        console.log("PayTech Response:", result);

        if (result.success === 1) {
            return { success: true, redirect_url: result.redirect_url };
        } else {
            return { success: false, message: result.errors?.[0] || "Erreur PayTech" };
        }
    } catch (error) {
        console.error("Erreur PayTech:", error);
        return { success: false, message: "Impossible de contacter PayTech" };
    }
}
