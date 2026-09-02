import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Secondary auth for verification without touching primary auth state
let secondaryAuth: any = null;
if (typeof window !== "undefined") {
    try {
        const secondaryApp = getApps().find(a => a.name === "secondary-2fa") 
            || initializeApp(firebaseConfig, "secondary-2fa");
        secondaryAuth = getAuth(secondaryApp);
        if (secondaryAuth && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
            secondaryAuth.settings.appVerificationDisabledForTesting = true;
        }
    } catch (e) {
        console.error("Error setting up secondary Firebase App:", e);
    }
}

export { app, db, auth, storage, secondaryAuth, firebaseConfig };
