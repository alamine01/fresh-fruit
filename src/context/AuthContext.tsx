"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    onAuthStateChanged,
    User,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    register: (email: string, pass: string, name: string) => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    loginWithPhone: (phoneNumber: string, recaptchaContainerId: string) => Promise<any>;
    saveUserToFirestore: (user: User, additionalData?: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithGoogle: async () => { },
    register: async () => { },
    loginWithEmail: async () => { },
    loginWithPhone: async () => { },
    saveUserToFirestore: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Optionnel : Passer en mode test pour éviter les blocages reCAPTCHA sur localhost
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            auth.settings.appVerificationDisabledForTesting = true;
        }
        
        auth.languageCode = 'fr';

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const saveUserToFirestore = async (user: User, additionalData: any = {}) => {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email || "",
            phone: user.phoneNumber || "",
            name: user.displayName || additionalData.name || "",
            photoURL: user.photoURL || "",
            createdAt: serverTimestamp(),
            ...additionalData
        }, { merge: true });
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup(auth, provider);
            await saveUserToFirestore(res.user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (email: string, pass: string, name: string) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(res.user, { displayName: name });
            await saveUserToFirestore(res.user, { name });
        } catch (error) {
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            throw error;
        }
    };

    const loginWithPhone = async (phoneNumber: string, recaptchaContainerId: string) => {
        try {
            const container = document.getElementById(recaptchaContainerId);
            if (container) container.innerHTML = ""; // Nettoyer pour éviter l'erreur "already rendered"

            if ((window as any).recaptchaVerifier) {
                try {
                    (window as any).recaptchaVerifier.clear();
                } catch (e) {
                    console.log("Error clearing recaptcha:", e);
                }
                (window as any).recaptchaVerifier = null;
            }

            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
                size: 'invisible'
            });

            return await signInWithPhoneNumber(auth, phoneNumber, (window as any).recaptchaVerifier);
        } catch (error) {
            if ((window as any).recaptchaVerifier) {
                try {
                    (window as any).recaptchaVerifier.clear();
                } catch (e) {}
                (window as any).recaptchaVerifier = null;
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            // Ignorer les erreurs de déconnexion
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, register, loginWithEmail, loginWithPhone, saveUserToFirestore, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
