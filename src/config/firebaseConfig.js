// src/config/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Use environment variable
  authDomain: "swapp-7f6f8.firebaseapp.com",
  projectId: "swapp-7f6f8",
  storageBucket: "swapp-7f6f8.appspot.com",
  messagingSenderId: "2516418590",
  appId: "1:2516418590:web:b08d4029ec2567f23b6e0f",
  measurementId: "G-H5MWBK70L9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { db, auth, provider, storage };
