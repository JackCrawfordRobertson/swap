// src/utils/auth.js

import { auth, db } from '../config/firebaseConfig';
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';

// Allowed email domains
const allowedDomains = ['aviva.com', 'ice-hub.biz', 'ya-ya.co.uk'];

/**
 * Checks if the provided email has an allowed domain.
 * @param {string} email - The user's email address.
 * @returns {boolean} - Returns true if the domain is allowed, false otherwise.
 */
const isAllowedDomain = (email) => {
  const emailDomain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.includes(emailDomain);
};

/**
 * Signs in a user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - Returns the authenticated user object.
 * @throws {Error} - Throws an error if sign-in fails.
 */
const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return user;
  } catch (error) {
    // Customize error messages based on error codes
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('No user found with this email.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password. Please try again.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address.');
      case 'auth/user-disabled':
        throw new Error('This user has been disabled.');
      default:
        throw new Error(error.message);
    }
  }
};

/**
 * Registers a new user with email, password, and username.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} username - The desired username.
 * @returns {Promise<Object>} - Returns the registered user object.
 * @throws {Error} - Throws an error if registration fails.
 */
const registerWithEmail = async (email, password, username) => {
  try {
    // Trim inputs to remove unnecessary whitespace
    email = email.trim().toLowerCase();
    username = username.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    // Check for allowed domains
    if (!isAllowedDomain(email)) {
      throw new Error('Email domain not allowed.');
    }

    // Check if username already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error('Username already taken. Please choose another.');
    }

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user information in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: email,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    // Customize error messages based on error codes
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('Email already in use. Please use a different email.');
      case 'auth/weak-password':
        throw new Error('Password is too weak. Please choose a stronger password.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address.');
      default:
        throw new Error(error.message);
    }
  }
};

/**
 * Sends a password reset email to the specified email address.
 * @param {string} email - The user's email address.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if password reset fails.
 */
const resetPassword = async (email) => {
  try {
    // Trim and lowercase the email
    email = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    // Customize error messages based on error codes
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('No user found with this email.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address.');
      default:
        throw new Error(error.message);
    }
  }
};

/**
 * Logs out the currently authenticated user.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if sign-out fails.
 */
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(`Error signing out: ${error.message}`);
    throw error;
  }
};

export { signInWithEmail, registerWithEmail, logout, resetPassword };