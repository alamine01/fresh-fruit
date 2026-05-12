"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('maya-cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage on changes
    useEffect(() => {
        localStorage.setItem('maya-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = React.useCallback((product: Product, quantity: number = 1) => {
        setCart((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        setIsOpen(true);
    }, []);

    const removeFromCart = React.useCallback((productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    }, []);

    const updateQuantity = React.useCallback((productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
        );
    }, []);

    const clearCart = React.useCallback(() => setCart([]), []);

    const toggleCart = React.useCallback(() => setIsOpen((prev) => !prev), []);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isOpen,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
