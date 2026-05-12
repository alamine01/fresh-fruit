"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { totalItems, toggleCart } = useCart();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={`container ${styles.headerContainer}`}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/logo.png" alt="Fresh Fruit Logo" className={styles.logoImg} />
          </Link>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Accueil</Link>
          <Link href="/shop" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Boutique</Link>
          <Link href="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>À Propos</Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </nav>

        <div className={styles.actions}>
          <button className={styles.burger} onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>


          <button className={styles.actionBtn} onClick={toggleCart}>
            <ShoppingBag size={22} />
            {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
          </button>

          <Link href="/account" className={styles.actionBtn}>
            {user ? (
              <div className={styles.userAvatar}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Compte'} className={styles.avatarImg} />
                ) : (
                  <User size={22} />
                )}
              </div>
            ) : (
              <User size={22} />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
