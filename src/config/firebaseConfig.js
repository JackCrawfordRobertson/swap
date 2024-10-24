// src/config/firebaseConfig.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Replace the below configuration with your actual Firebase project details
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Ensure this environment variable is set correctly
  authDomain: "swapp-7f6f8.firebaseapp.com",
  projectId: "swapp-7f6f8",
  storageBucket: "swapp-7f6f8.appspot.com",
  messagingSenderId: "2516418590",
  appId: "1:2516418590:web:b08d4029ec2567f23b6e0f",
  measurementId: "G-H5MWBK70L9"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export the initialized services for use in other parts of the app
export { db, auth, storage };