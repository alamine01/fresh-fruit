"use client";

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/firestore';
import styles from './page.module.css';
import { Filter, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Données réelles Fresh Fruit - URLs d'images vérifiées
const categories = ['Tous', 'Fruits de Saison', 'Jus Naturels', 'Paniers Mixtes', 'Exotiques'];

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [absoluteMax, setAbsoluteMax] = useState(100000);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                
                if (data.length > 0) {
                    const highestPrice = Math.max(...data.map(p => p.price));
                    // Arrondir au millier supérieur pour un affichage propre
                    const roundedMax = Math.ceil(highestPrice / 1000) * 1000;
                    setAbsoluteMax(roundedMax || 25000);
                    setMaxPrice(roundedMax || 25000);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'Tous' || product.category === activeCategory;
        const matchesPrice = product.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });

    const SidebarContent = () => (
        <>
            <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>
                    <Filter size={18} /> Catégories
                </h3>
                <ul className={styles.filterList}>
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                className={activeCategory === cat ? styles.activeFilter : ''}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    if (window.innerWidth <= 768) setIsFilterOpen(false);
                                }}
                            >
                                {cat}
                                {activeCategory === cat && <ChevronRight size={14} />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.filterSection}>
                <div className={styles.filterTitle}>
                    <SlidersHorizontal size={18} />
                    <div className={styles.filterTitleContent}>
                        <span className={styles.filterLabel}>Prix maximum :</span>
                        <span className={styles.filterValue}>{maxPrice.toLocaleString()} CFA</span>
                    </div>
                </div>
                <div className={styles.priceRange}>
                    <input
                        type="range"
                        min="0"
                        max={absoluteMax}
                        step="500"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <div className={styles.priceLabels}>
                        <span>0 CFA</span>
                        <span>{absoluteMax.toLocaleString()} CFA</span>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className={`container ${styles.shopPage}`}>
            <motion.header
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className={styles.title}>Notre Catalogue</h1>
                <p className={styles.subtitle}>Découvrez notre sélection de fruits frais mûris à point et nos jus naturels pressés chaque matin.</p>
            </motion.header>

            <div className={styles.layout}>
                <motion.aside
                    className={styles.sidebar}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <SidebarContent />
                </motion.aside>

                <AnimatePresence>
                    {isFilterOpen && (
                        <>
                            <motion.div
                                className={styles.mobileOverlay}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFilterOpen(false)}
                            />
                            <motion.aside
                                className={styles.mobileSidebar}
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            >
                                <div className={styles.mobileSidebarHeader}>
                                    <h3>Filtres</h3>
                                    <button onClick={() => setIsFilterOpen(false)} className={styles.closeBtn}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className={styles.mobileSidebarContent}>
                                    <SidebarContent />
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                <main className={styles.main}>
                    <div className={styles.resultsBar}>
                        <div className={styles.mobileFilterToggle}>
                            <button
                                className={styles.filterBtn}
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <Filter size={18} /> Filtrer
                            </button>
                        </div>
                        <span className={styles.resultsCount}>{filteredProducts.length} produits trouvés</span>
                        <div className={styles.controls}>
                            {/* Tri retiré */}
                        </div>
                    </div>

                    <div className={styles.productGrid} style={{ minHeight: '400px' }}>
                        {loading ? (
                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    style={{ width: 50, height: 50, border: '5px solid #eee', borderTopColor: 'var(--primary-green)', borderRadius: '50%' }}
                                />
                                <p style={{ marginTop: '1rem', color: '#666', fontWeight: 600 }}>Récolte de vos fruits en cours...</p>
                            </div>
                        ) : (
                            <AnimatePresence mode='popLayout'>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem' }}>
                                        <p style={{ fontSize: '1.2rem', color: '#666' }}>Aucun produit ne correspond à vos critères.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
