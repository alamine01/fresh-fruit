"use client";

import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Wrench } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isNoLayoutPage = pathname?.startsWith("/admin") || pathname?.startsWith("/account");
    const isAdmin = pathname?.startsWith("/admin");
    const [maintenance, setMaintenance] = useState(false);

    useEffect(() => {
        const docRef = doc(db, "settings", "general");
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setMaintenance(docSnap.data().maintenanceMode || false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + Shift + F (F pour Fresh Fruit)
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                router.push("/admin");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    if (maintenance && !isAdmin) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8f9fa', textAlign: 'center', padding: '2rem' }}>
                <Wrench size={64} color="var(--primary-orange)" style={{ marginBottom: '2rem' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: 800 }}>Site en maintenance</h1>
                <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', lineHeight: '1.6' }}>Nous améliorons actuellement notre plateforme pour mieux vous servir. <br/> Fresh Fruit sera de retour très bientôt avec des fruits encore plus frais ! 🍊</p>
            </div>
        );
    }

    if (isNoLayoutPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <CartDrawer />
            <main>{children}</main>
            <Footer />
        </>
    );
}
