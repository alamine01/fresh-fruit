"use server";

export async function createPayTechPayment(orderData: any, paymentMethod: string) {
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
                "API_SECRET": API_SECRET
            },
            body: JSON.stringify({
                item_name: "Commande Fresh Fruit",
                item_price: Math.round(orderData.total),
                currency: "XOF",
                ref_command: orderData.orderId,
                command_name: "Paiement de la commande #" + orderData.orderId,
                env: "prod",
                target_payment: paymentMethod === 'wave' ? 'Wave' : (paymentMethod === 'om' ? 'Orange Money' : null),
                success_url: orderData.origin + "/checkout/success",
                cancel_url: orderData.origin + "/checkout/cancel",
                ipn_url: orderData.origin + "/api/webhooks/paytech",
                custom_field: JSON.stringify(orderData.customer)
            })
        });

        const result = await response.json();
        console.log("PayTech Response:", result);

        if (result.success === 1) {
            const redirectUrl = result.redirect_url;
            
            // Préparation des paramètres de pré-remplissage
            const phone = (orderData.customer.phone || "").replace(/\s+/g, '').replace(/\+/g, '');
            const phoneWithPrefix = phone.startsWith('221') ? `+${phone}` : `+221${phone}`;
            const phoneNoPrefix = phone.startsWith('221') ? phone.substring(3) : phone;
            const fullName = `${orderData.customer.firstName || ""} ${orderData.customer.lastName || ""}`.trim();
            const tp = paymentMethod === 'wave' ? 'Wave' : 'Orange Money';

            // Construction manuelle pour éviter tout souci de compatibilité
            const finalUrl = `${redirectUrl}?tp=${encodeURIComponent(tp)}&nac=1&fn=${encodeURIComponent(fullName)}&pn=${encodeURIComponent(phoneWithPrefix)}&nn=${encodeURIComponent(phoneNoPrefix)}`;

            return { success: true, redirect_url: finalUrl };
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
