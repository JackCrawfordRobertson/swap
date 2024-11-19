// src/config/firebaseConfig.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Determine the environment and set Firebase config accordingly
const isProduction = process.env.NODE_ENV === "production";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: isProduction
    ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    : "swap-dev-8db69.firebaseapp.com",
  projectId: isProduction
    ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    : "swap-dev-8db69",
  storageBucket: isProduction
    ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    : "swap-dev-8db69.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Conditionally set Firestore logging level based on environment
if (isProduction) {
  setLogLevel("debug"); // Reduce logging in production
} else {
  setLogLevel("warn"); // More detailed logging in development
}

// Export the initialized services for use in other parts of the app
export { db, auth, storage };