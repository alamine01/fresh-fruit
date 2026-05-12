export async function sendAdminOrderAlert(order: any) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const apiKey = process.env.BREVO_API_KEY;

    if (!adminEmail || !apiKey) {
        console.warn("Configuration Brevo manquante (ADMIN_EMAIL ou BREVO_API_KEY)");
        return;
    }

    const itemsHtml = order.items.map((item: any) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${(item.price * item.quantity).toLocaleString()} CFA</td>
        </tr>
    `).join('');

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #2E7D32; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Nouvelle Commande ! 🍊</h1>
            </div>
            <div style="padding: 20px;">
                <p>Bonjour,</p>
                <p>Vous avez reçu une nouvelle commande sur <strong>Fresh Fruit</strong>.</p>
                
                <h3 style="color: #2E7D32;">📦 Détails de la livraison</h3>
                <p>
                    <strong>Client :</strong> ${order.customer.firstName} ${order.customer.lastName}<br>
                    <strong>Téléphone :</strong> ${order.customer.phone}<br>
                    <strong>Quartier :</strong> ${order.customer.neighborhood}<br>
                    <strong>Adresse :</strong> ${order.customer.address || 'Non précisée'}
                </p>

                <h3 style="color: #2E7D32;">🛒 Panier</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f9f9f9;">
                            <th style="text-align: left; padding: 10px;">Produit</th>
                            <th style="text-align: left; padding: 10px;">Qté</th>
                            <th style="text-align: left; padding: 10px;">Prix</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <div style="margin-top: 20px; text-align: right; font-size: 1.2rem;">
                    <strong>Total : ${order.total.toLocaleString()} CFA</strong>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/orders" style="background-color: #2E7D32; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Gérer la commande
                    </a>
                </div>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 0.8rem; color: #888;">
                Fresh Fruit - Livraison de fruits frais à Dakar
            </div>
        </div>
    `;

    try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: { name: "Fresh Fruit", email: "no-reply@fresh-fruit.sn" },
                to: [{ email: adminEmail }],
                subject: `🚀 Nouvelle commande de ${order.customer.firstName} (${order.total.toLocaleString()} CFA)`,
                htmlContent: htmlContent
            })
        });
        console.log("Alerte email envoyée à l'admin");
    } catch (error) {
        console.error("Erreur envoi alerte email:", error);
    }
}
