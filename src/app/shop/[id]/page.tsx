import { Product } from '@/types';
import styles from './ProductDetail.module.css';
import Link from 'next/link';
import { Truck, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

import ProductActions from '@/components/product/ProductActions';

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    
    // Récupération réelle depuis Firestore
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
        return (
            <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>
                <h2>Produit introuvable</h2>
                <Link href="/shop" className="btn btn-primary" style={{ marginTop: '2rem' }}>Retour à la boutique</Link>
            </div>
        );
    }

    const product = { id: docSnap.id, ...docSnap.data() } as Product;

    return (
        <div className={`container ${styles.productPage}`}>
            <div className={styles.topNav}>
                <Link href="/shop" className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    <span>Retour à la boutique</span>
                </Link>
                <nav className={styles.breadcrumb}>
                    <Link href="/shop">Boutique</Link> / <span>{product.name}</span>
                </nav>
            </div>

            <div className={styles.layout}>
                <div className={styles.imageSection}>
                    <img src={product.image} alt={product.name} className={styles.mainImage} />
                    {!product.inStock && (
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            background: '#f44336',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            zIndex: 10
                        }}>
                            ÉPUISÉ
                        </div>
                    )}
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

                    <ProductActions product={product} />
                </div>
            </div>
        </div>
    );
}
