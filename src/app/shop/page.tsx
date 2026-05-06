"use client";

import { useState } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';
import { Filter, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const categories = ['Tous', 'Fruits de Saison', 'Jus Naturels', 'Paniers Mixtes', 'Exotiques'];

export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [maxPrice, setMaxPrice] = useState(25000);

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
                        max="25000"
                        step="500"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <div className={styles.priceLabels}>
                        <span>0 CFA</span>
                        <span>25 000 CFA</span>
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
                            <select className={styles.sort}>
                                <option>Trier par : Nouveautés</option>
                                <option>Prix : Croissant</option>
                                <option>Prix : Décroissant</option>
                            </select>
                        </div>
                    </div>

                    <motion.div
                        className={styles.productGrid}
                        layout
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product, index) => (
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
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
