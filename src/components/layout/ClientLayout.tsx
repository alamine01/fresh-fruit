"use client";

import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isAdmin = pathname?.startsWith("/admin");

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

    if (isAdmin) {
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
