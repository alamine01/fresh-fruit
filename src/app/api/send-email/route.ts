import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { to, subject, htmlContent } = await req.json();

        const apiKey = process.env.BREVO_API_KEY;
        if (!apiKey) {
            console.error("BREVO_API_KEY manquante dans le .env");
            return NextResponse.json({ error: "Configuration email manquante" }, { status: 500 });
        }

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: { name: "Fresh Fruit Admin", email: "no-reply@fresh-fruit.sn" },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erreur lors de l'envoi");
        }

        return NextResponse.json({ success: true, messageId: data.messageId });
    } catch (error: any) {
        console.error("Erreur Brevo:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
