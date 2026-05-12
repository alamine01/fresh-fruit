"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import styles from '@/app/shop/[id]/ProductDetail.module.css';
import { ShoppingBag, Minus, Plus } from 'lucide-react';

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (product.inStock !== false) {
            addToCart(product, quantity);
        }
    };

    return (
        <div className={styles.actions}>
            <div className={styles.quantity}>
                <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={!product.inStock}
                >
                    <Minus size={18} />
                </button>
                <span>{quantity}</span>
                <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    disabled={!product.inStock}
                >
                    <Plus size={18} />
                </button>
            </div>
            <button 
                className="btn btn-primary" 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.8rem',
                    backgroundColor: product.inStock ? 'var(--primary-green)' : '#ccc',
                    color: product.inStock ? 'white' : '#666',
                    border: 'none',
                    opacity: product.inStock ? 1 : 0.7
                }}
            >
                <ShoppingBag size={20} />
                {product.inStock ? "Ajouter au panier" : "Épuisé"}
            </button>
        </div>
    );
}
