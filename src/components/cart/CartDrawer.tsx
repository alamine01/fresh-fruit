"use client";

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
    const { cart, isOpen, toggleCart, removeFromCart, updateQuantity, totalPrice } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                    />
                    <motion.div
                        className={styles.drawer}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className={styles.header}>
                            <div className={styles.headerTitle}>
                                <ShoppingBag size={20} />
                                <h2>Votre Panier</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={toggleCart}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.content}>
                            {cart.length === 0 ? (
                                <div className={styles.empty}>
                                    <ShoppingBag size={48} strokeWidth={1} />
                                    <p>Votre panier est vide</p>
                                    <Link href="/shop" className="btn btn-primary" onClick={toggleCart}>
                                        Découvrir la boutique
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.itemsWrapper}>
                                    <div className={styles.items}>
                                        {cart.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                className={styles.item}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                            >
                                                <div className={styles.itemImageWrapper}>
                                                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                                                </div>
                                                <div className={styles.itemInfo}>
                                                    <h3>{item.name}</h3>
                                                    <p className={styles.itemPrice}>{item.price.toLocaleString()} CFA</p>
                                                    <div className={styles.quantityControls}>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className={styles.qtyBtn}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className={styles.qtyValue}>{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className={styles.qtyBtn}
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className={styles.footer}>
                                        <div className={styles.summary}>
                                            <div className={styles.totalRow}>
                                                <span>Sous-total</span>
                                                <span>{totalPrice.toLocaleString()} CFA</span>
                                            </div>
                                            <div className={styles.totalRow}>
                                                <span>Livraison</span>
                                                <span className={styles.free}>Offerte (Dakar)</span>
                                            </div>
                                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                                <span>Total</span>
                                                <span>{totalPrice.toLocaleString()} CFA</span>
                                            </div>
                                        </div>

                                        <Link
                                            href="/checkout"
                                            className="btn btn-primary"
                                            style={{ width: '100%', padding: '1.25rem' }}
                                            onClick={toggleCart}
                                        >
                                            Passer à la caisse <ArrowRight size={18} />
                                        </Link>

                                        <p className={styles.secureInfo}>
                                            <Lock size={14} /> Paiement 100% sécurisé
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
