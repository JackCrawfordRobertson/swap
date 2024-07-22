// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGKDKrK84FhXHyR9PRZi07uIrBFoxz9Jo",
  authDomain: "swap-32989.firebaseapp.com",
  projectId: "swap-32989",
  storageBucket: "swap-32989.appspot.com",
  messagingSenderId: "1048701574427",
  appId: "1:1048701574427:web:29a7889b3915bdda6b07be",
  measurementId: "G-07D48XCYPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { db, auth, provider, storage };
