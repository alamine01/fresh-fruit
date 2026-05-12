"use client";

import { useState, useEffect } from "react";
import styles from "./products.module.css";
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Search, 
    Image as ImageIcon,
    Loader2
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

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        category: "Fruits de Saison",
        description: "",
        image: ""
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
        } catch (error) {
            alert("Erreur lors de l'upload de l'image");
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

    const handleDelete = async (id: string) => {
        if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
            await deleteProduct(id);
            fetchProducts();
        }
    };

    const resetForm = () => {
        setFormData({ name: "", price: 0, category: "Fruits de Saison", description: "", image: "" });
        setEditingProduct(null);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image
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

            <div className={styles.tableContainer}>
                {loading ? (
                    <div style={{ padding: '5rem', textAlign: 'center' }}>
                        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-green)', margin: '0 auto' }} />
                        <p style={{ marginTop: '1rem', color: '#666' }}>Chargement du catalogue...</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Catégorie</th>
                                <th>Prix</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className={styles.productInfo}>
                                            <img src={product.image} alt={product.name} className={styles.productThumb} />
                                            <div>
                                                <span className={styles.productName}>{product.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={styles.productCategory}>{product.category}</span></td>
                                    <td><span className={styles.priceTag}>{product.price.toLocaleString()} CFA</span></td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEditModal(product)}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(product.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

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
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
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
                                                <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
                                            ) : formData.image ? (
                                                <img src={formData.image} alt="Preview" className={styles.previewImg} />
                                            ) : (
                                                <>
                                                    <ImageIcon size={40} style={{ color: '#ccc', marginBottom: '1rem' }} />
                                                    <p>Cliquez pour uploader une photo</p>
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
        </div>
    );
}
