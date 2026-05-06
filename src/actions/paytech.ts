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
            let redirectUrl = result.redirect_url;
            
            // Paramètres pour sauter la sélection et pré-remplir (méthode du projet Airbnb)
            const cleanPhone = orderData.customer.phone.replace(/\s+/g, '').replace(/\+/g, '');
            const phoneWithPrefix = cleanPhone.startsWith('221') ? `+${cleanPhone}` : `+221${cleanPhone}`;
            const phoneNoPrefix = cleanPhone.startsWith('221') ? cleanPhone.substring(3) : cleanPhone;

            const params = new URLSearchParams({
                'tp': paymentMethod === 'wave' ? 'Wave' : 'Orange Money',
                'nac': '1',
                'fn': `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                'pn': phoneWithPrefix,
                'nn': phoneNoPrefix
            });

            return { success: true, redirect_url: `${redirectUrl}?${params.toString()}` };
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
