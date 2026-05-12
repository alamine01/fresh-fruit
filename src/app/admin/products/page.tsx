"use client";

import { useState, useEffect } from "react";
import styles from "./products.module.css";
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Search, 
    Image as ImageIcon,
    Loader2,
    AlertTriangle,
    Filter,
    CheckCircle2,
    XCircle,
    ChevronDown
} from "lucide-react";
import { getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage } from "@/lib/firestore";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [stockFilter, setStockFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        category: "Fruits de Saison",
        description: "",
        image: "",
        inStock: true
    });

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStock = stockFilter === "all" ? true :
                            stockFilter === "inStock" ? p.inStock !== false :
                            p.inStock === false;

        return matchesSearch && matchesStock;
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadProductImage(file);
            setFormData({ ...formData, image: url });
        } catch (error: any) {
            console.error("Erreur Upload détaillé:", error);
            alert(`Erreur d'upload: ${error.message || "Problème de connexion ou de droits Firebase"}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
            } else {
                await addProduct(formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            await deleteProduct(productToDelete);
            setProductToDelete(null);
            fetchProducts();
        }
    };

    const resetForm = () => {
        setFormData({ name: "", price: 0, category: "Fruits de Saison", description: "", image: "", inStock: true });
        setEditingProduct(null);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image,
            inStock: product.inStock !== undefined ? product.inStock : true
        });
        setIsModalOpen(true);
    };

    return (
        <div className={styles.productPage}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Gestion des Produits</h1>
                    <p>{products.length} produits enregistrés</p>
                </div>
                <button 
                    className="btn btn-primary" 
                    style={{ gap: '0.5rem' }}
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                >
                    <Plus size={20} /> Ajouter un fruit
                </button>
            </header>

            {loading ? (
                <div className={styles.tableContainer}>
                    <div style={{ padding: '5rem', textAlign: 'center' }}>
                        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-green)', margin: '0 auto' }} />
                        <p style={{ marginTop: '1rem', color: '#666' }}>Chargement du catalogue...</p>
                    </div>
                </div>
            ) : (
                <div className="content-section">
                    <div className={styles.actionBar}>
                        <div className={styles.searchBar}>
                            <Search size={20} />
                            <input 
                                type="text" 
                                placeholder="Rechercher un fruit..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <button 
                                className={styles.filterSelect}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.8rem',
                                    justifyContent: 'space-between',
                                    paddingRight: '1rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    {stockFilter === "all" ? <Filter size={18} /> : 
                                     stockFilter === "inStock" ? <CheckCircle2 size={18} color="var(--primary-green)" /> : 
                                     <XCircle size={18} color="#D32F2F" />}
                                    <span>
                                        {stockFilter === "all" ? "Tous les stocks" : 
                                         stockFilter === "inStock" ? "En stock" : "Épuisés"}
                                    </span>
                                </div>
                                <ChevronDown size={16} style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                            </button>

                            <AnimatePresence>
                                {isFilterOpen && (
                                    <motion.div 
                                        className={styles.dropdown}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{ width: '220px', padding: '0.5rem', right: 0 }}
                                    >
                                        <button 
                                            onClick={() => { setStockFilter("all"); setIsFilterOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '10px' }}
                                        >
                                            <Filter size={16} /> Tous les stocks
                                        </button>
                                        <button 
                                            onClick={() => { setStockFilter("inStock"); setIsFilterOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '10px' }}
                                        >
                                            <CheckCircle2 size={16} color="var(--primary-green)" /> En stock
                                        </button>
                                        <button 
                                            onClick={() => { setStockFilter("outOfStock"); setIsFilterOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '10px' }}
                                        >
                                            <XCircle size={16} color="#D32F2F" /> Épuisés
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    
                    <div className={styles.tableContainer} style={{ overflow: 'visible' }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Catégorie</th>
                                    <th>Prix</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className={styles.productInfo}>
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className={styles.productThumb} />
                                                ) : (
                                                    <div className={styles.productThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                                                        <ImageIcon size={20} color="#ccc" />
                                                    </div>
                                                )}
                                                <div>
                                                    <span className={styles.productName}>{product.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={styles.productCategory}>{product.category}</span></td>
                                        <td><span className={styles.priceTag}>{product.price.toLocaleString()} CFA</span></td>
                                        <td>
                                            <span style={{ 
                                                padding: '0.3rem 0.6rem', 
                                                borderRadius: '20px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 700, 
                                                backgroundColor: product.inStock !== false ? '#E8F5E9' : '#FFEBEE',
                                                color: product.inStock !== false ? '#2E7D32' : '#C62828'
                                            }}>
                                                {product.inStock !== false ? "En stock" : "Épuisé"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEditModal(product)}>
                                                    <Pencil size={18} />
                                                </button>
                                                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setProductToDelete(product.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Form */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <motion.div 
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <h2>{editingProduct ? "Modifier le produit" : "Ajouter un nouveau fruit"}</h2>
                            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                                <div className={styles.formGrid}>
                                    <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                        <label>Nom du produit</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Prix (CFA)</label>
                                        <input 
                                            type="number" 
                                            value={formData.price === 0 ? "" : formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value === "" ? 0 : Number(e.target.value)})}
                                            required 
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Catégorie</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            <option>Fruits de Saison</option>
                                            <option>Exotiques</option>
                                            <option>Jus Naturels</option>
                                            <option>Paniers Mixtes</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingTop: '1.5rem' }}>
                                        <input 
                                            type="checkbox" 
                                            id="inStock"
                                            checked={formData.inStock}
                                            onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                        <label htmlFor="inStock" style={{ cursor: 'pointer', marginBottom: 0 }}>Produit disponible en stock</label>
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                        <label>Description</label>
                                        <textarea 
                                            rows={3} 
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                        <label>Image du produit</label>
                                        <div className={styles.imageUpload} onClick={() => document.getElementById('fileInput')?.click()}>
                                            {uploading ? (
                                                <div style={{ padding: '1rem' }}>
                                                    <Loader2 className="animate-spin" style={{ margin: '0 auto', color: 'var(--primary-green)' }} size={32} />
                                                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Upload en cours...</p>
                                                </div>
                                            ) : formData.image ? (
                                                <div style={{ position: 'relative' }}>
                                                    <img src={formData.image} alt="Preview" className={styles.previewImg} />
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        top: '10px', 
                                                        right: '10px', 
                                                        background: '#2E7D32', 
                                                        color: 'white', 
                                                        padding: '4px 12px', 
                                                        borderRadius: '20px', 
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <CheckCircle2 size={14} /> Image prête
                                                    </div>
                                                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>Cliquez pour changer la photo</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <ImageIcon size={40} style={{ color: '#ccc', marginBottom: '1rem' }} />
                                                    <p>Cliquez pour uploader une photo</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>Format conseillé : Carré (1:1)</p>
                                                </>
                                            )}
                                            <input 
                                                id="fileInput" 
                                                type="file" 
                                                hidden 
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" className="btn" style={{ flex: 1, backgroundColor: '#eee' }} onClick={() => setIsModalOpen(false)}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={uploading}>
                                        {editingProduct ? "Enregistrer les modifications" : "Ajouter au catalogue"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {productToDelete && (
                    <div className={styles.modalOverlay}>
                        <motion.div 
                            className={styles.modal}
                            style={{ maxWidth: '400px', textAlign: 'center' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div style={{ 
                                width: '60px', 
                                height: '60px', 
                                backgroundColor: '#FFEBEB', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 1.5rem',
                                color: '#D32F2F'
                            }}>
                                <AlertTriangle size={30} />
                            </div>
                            <h3>Supprimer le produit ?</h3>
                            <p style={{ color: '#666', margin: '1rem 0 2rem' }}>
                                Cette action est irréversible. Le fruit sera définitivement retiré de votre catalogue.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn" style={{ flex: 1, backgroundColor: '#eee' }} onClick={() => setProductToDelete(null)}>
                                    Annuler
                                </button>
                                <button className="btn" style={{ flex: 1, backgroundColor: '#D32F2F', color: 'white' }} onClick={confirmDelete}>
                                    Supprimer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
