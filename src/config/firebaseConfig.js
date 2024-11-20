// firebaseConfig.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

let firebaseInitialized = false;
let firebaseServices = {};

/**
 * Validate Firebase configuration
 */
const validateFirebaseConfig = (config) => {
  const requiredKeys = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
    "measurementId",
  ];

  const missingKeys = requiredKeys.filter((key) => !config[key]);
  if (missingKeys.length > 0) {
    console.error(
      `Missing Firebase configuration keys: ${missingKeys.join(", ")}`
    );
    return false;
  }
  return true;
};

/**
 * Initialize Firebase
 */
const initializeFirebase = async () => {
  if (firebaseInitialized) {
    console.log("Firebase already initialized. Returning cached services.");
    return firebaseServices;
  }

  console.log("Initializing Firebase configuration...");

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  console.log("Firebase Config:", firebaseConfig);

  // Validate Firebase configuration
  if (!validateFirebaseConfig(firebaseConfig)) {
    throw new Error(
      "Firebase configuration is invalid. Check your environment variables."
    );
  }

  try {
    // Initialize Firebase app
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log("Firebase app initialized:", app.name);

    // Initialize Firebase services
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    // Set Firestore logging level
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction) {
      setLogLevel("error");
      console.log("Firestore log level set to 'error' for production.");
    } else {
      setLogLevel("warn");
      console.log("Firestore log level set to 'warn' for development.");
    }

    // Cache Firebase services
    firebaseServices = { db, auth, storage, app };
    firebaseInitialized = true;

    console.log("Firebase services initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }

  return firebaseServices;
};

export default initializeFirebase;