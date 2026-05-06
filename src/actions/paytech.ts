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
                "Accept": "application/json",
                "API_KEY": API_KEY,
                "API_SECRET": API_SECRET,
                "api_key": API_KEY, // Doublon en minuscule au cas où
                "api_secret": API_SECRET
            },
            body: JSON.stringify({
                item_name: "Commande Fresh Fruit",
                item_price: Math.round(orderData.total).toString(),
                currency: "XOF",
                ref_command: orderData.orderId,
                command_name: "Paiement de la commande #" + orderData.orderId,
                env: "live",
                success_url: orderData.origin + "/checkout/success",
                cancel_url: orderData.origin + "/checkout/cancel",
                custom_field: JSON.stringify(orderData.customer),
                api_key: API_KEY, // Ajout dans le corps pour certaines versions de l'API
                api_secret: API_SECRET
            })
        });

        const result = await response.json();
        console.log("PayTech Response:", result);

        if (result.success === 1) {
            return { success: true, redirect_url: result.redirect_url };
        } else {
            // Extraire les messages d'erreur s'ils existent
            const errorMsg = result.errors && result.errors.length > 0 
                ? result.errors.join(", ") 
                : `Erreur de configuration (La clé commence par: ${API_KEY.substring(0, 4)}...)`;
            return { success: false, message: errorMsg };
        }
    } catch (error) {
        console.error("Erreur PayTech:", error);
        return { success: false, message: "Impossible de contacter PayTech" };
    }
}
