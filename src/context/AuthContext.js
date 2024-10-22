// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    console.log('Initializing AuthContext listener.');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('User is authenticated with UID:', currentUser.uid);
        setUser(currentUser);
      } else {
        console.log('User is not authenticated.');
        setUser(null);
      }
      setLoading(false); // Set loading to false when auth state is known
    });

    return () => {
      console.log('Unsubscribing AuthContext listener.');
      unsubscribe();
    };
  }, []);

  if (loading) {
    // You can return a loading indicator here if you prefer
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};