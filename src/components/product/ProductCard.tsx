"use client";

import Link from 'next/link';
import { Product } from '@/types';
import styles from './ProductCard.module.css';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            className={styles.card}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className={styles.imageWrapper}>
                <Link href={`/shop/${product.id}`} className={styles.imageLink}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className={styles.image}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=600'; // Fallback food image
                        }}
                    />
                </Link>

                {product.featured && <span className={styles.badge}>Nouveau</span>}

                <div className={styles.actionsOverlay}>
                    <button
                        className={styles.iconAction}
                        onClick={() => addToCart(product)}
                        title="Ajouter au panier"
                    >
                        <Plus size={20} />
                    </button>
                    <Link href={`/shop/${product.id}`} className={styles.iconAction} title="Voir détails">
                        <Eye size={20} />
                    </Link>
                </div>
            </div>

            <div className={styles.info}>
                <div className={styles.meta}>
                    <span className={styles.category}>{product.category}</span>
                    <span className={styles.price}>{product.price.toLocaleString()} CFA</span>
                </div>
                <Link href={`/shop/${product.id}`}>
                    <h3 className={styles.name}>{product.name}</h3>
                </Link>
                <button
                    className={styles.addBtn}
                    onClick={() => addToCart(product)}
                >
                    <ShoppingBag size={18} /> Ajouter au panier
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
