"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";
import { 
    LayoutDashboard, 
    ShoppingBasket, 
    Users, 
    Settings, 
    LogOut,
    Apple,
    ShoppingBag
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: ShoppingBasket, label: "Produits", href: "/admin/products" },
        { icon: ShoppingBag, label: "Commandes", href: "/admin/orders" },
        { icon: Users, label: "Clients", href: "/admin/customers" },
        { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    ];

    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Apple /> <span>Fresh Admin</span>
                </div>
                
                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ""}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <Link href="/" className={styles.navLink}>
                        <LogOut size={20} />
                        <span>Quitter l'admin</span>
                    </Link>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
