import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    query, 
    orderBy,
    getDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { Product } from "@/types";

const PRODUCTS_COLLECTION = "products";

export const getProducts = async () => {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[];
};

export const addProduct = async (product: Omit<Product, "id">) => {
    return await addDoc(collection(db, PRODUCTS_COLLECTION), product);
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    return await updateDoc(docRef, product);
};

export const deleteProduct = async (id: string) => {
    return await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
};

export const uploadProductImage = async (file: File) => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};
