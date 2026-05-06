import { Product } from '@/types';
import styles from './ProductDetail.module.css';
import Link from 'next/link';
import { Truck, ShieldCheck } from 'lucide-react';

// Données réelles Fresh Fruit - URLs d'images vérifiées
const products: Product[] = [
    { id: '1', name: 'Pommes Gala (Kg)', price: 1500, category: 'Fruits de Saison', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600', description: 'Pommes croquantes et sucrées, idéales pour le goûter.' },
    { id: '2', name: 'Bananes Bio (6 pièces)', price: 2000, category: 'Fruits de Saison', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=600', description: 'Bananes biologiques issues du commerce équitable.' },
    { id: '3', name: 'Mangue Kent d\'Exception', price: 1800, category: 'Exotiques', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600', description: 'Mangue charnue et sans fibres, mûrie à point.' },
    { id: '4', name: 'Fraises de Saison (250g)', price: 3000, category: 'Fruits de Saison', image: 'https://images.unsplash.com/photo-1464965211926-1d820b7095a0?auto=format&fit=crop&q=80&w=600', description: 'Fraises locales ultra-fraîches et parfumées.' },
    { id: '5', name: 'Jus d\'Orange Pressé (1L)', price: 3500, category: 'Jus Naturels', image: 'https://images.unsplash.com/photo-1600271886342-dc672e471b99?auto=format&fit=crop&q=80&w=600', description: '100% pur jus pressé chaque matin, sans additifs.' },
    { id: '6', name: 'Panier Famille Hebdo', price: 20000, category: 'Paniers Mixtes', image: 'https://images.unsplash.com/photo-1610397648930-477b8c7f0943?auto=format&fit=crop&q=80&w=600', description: 'Un assortiment de 5kg de fruits de saison pour toute la famille.' },
    { id: '7', name: 'Jus Pomme-Gingembre (250ml)', price: 2000, category: 'Jus Naturels', image: 'https://images.unsplash.com/photo-1544787210-2211d7c9282b?auto=format&fit=crop&q=80&w=600', description: 'Un cocktail énergisant pressé à froid.' },
    { id: '8', name: 'Ananas Victoria (Pièce)', price: 3000, category: 'Exotiques', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=600', description: 'Le plus petit et le plus sucré des ananas.' },
    { id: '9', name: 'Panier Bureau Vitaminé', price: 15000, category: 'Paniers Mixtes', image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=600', description: 'Sélection de fruits faciles à déguster sur son lieu de travail.' },
    { id: '10', name: 'Framboises Fraîches (125g)', price: 2500, category: 'Fruits de Saison', image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600', description: 'Framboises cueillies à la main, un délice de finesse.' },
];

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const product = products.find((p) => p.id === id) || products[0];

    return (
        <div className={`container ${styles.productPage}`}>
            <nav className={styles.breadcrumb}>
                <Link href="/shop">Boutique</Link> / <span>{product.name}</span>
            </nav>

            <div className={styles.layout}>
                <div className={styles.imageSection}>
                    <img src={product.image} alt={product.name} className={styles.mainImage} />
                </div>

                <div className={styles.infoSection}>
                    <span className={styles.category}>{product.category}</span>
                    <h1 className={styles.name}>{product.name}</h1>
                    <p className={styles.price}>{product.price.toLocaleString()} CFA</p>

                    <div className={styles.description}>
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <div className={styles.iconWrapper}>
                                <Truck size={24} />
                            </div>
                            <div>
                                <strong>Livraison Locale</strong>
                                <p>Livraison rapide à Dakar</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.iconWrapper}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <strong>Artisanat Authentique</strong>
                                <p>Produits sourcés directement</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.quantity}>
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                        </div>
                        <button className="btn btn-primary">Ajouter au panier</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
