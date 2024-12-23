"use client";
// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import initializeFirebase from "../config/firebaseConfig";

export const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const initializeAuthListener = async () => {
      const { auth } = await initializeFirebase(); // Dynamically initialize Firebase
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
        setLoading(false); // Set loading to false when auth state is known
      });

      return () => {
        unsubscribe();
      };
    };

    initializeAuthListener();
  }, []);

  if (loading) {
    // You can return a loading indicator here if you prefer
    return null;
  }

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};