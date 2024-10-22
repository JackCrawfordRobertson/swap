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
  console.log(`Checking if email domain '${emailDomain}' is allowed.`);
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
    console.log(`Signing in user with Email: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Removed email verification check

    console.log('User signed in successfully:', user.uid);
    return user;
  } catch (error) {
    console.error('Error signing in with email:', error);
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
    console.log(`Registering user with Email: ${email}, Username: ${username}`);
    // Trim inputs to remove unnecessary whitespace
    email = email.trim().toLowerCase();
    username = username.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format during registration.');
      throw new Error('Please enter a valid email address.');
    }

    // Check for allowed domains
    if (!isAllowedDomain(email)) {
      console.log('Email domain not allowed during registration:', email);
      throw new Error(
        `Email domain not allowed. Please use one of the following domains: ${allowedDomains.join(
          ', '
        )}.`
      );
    }

    // Check if username already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    console.log('Checking if username already exists in Firestore.');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log('Username already taken:', username);
      throw new Error('Username already taken. Please choose another.');
    }

    // Create user with email and password
    console.log('Creating new user in Firebase Auth.');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created with UID:', user.uid);

    // Removed sending email verification

    // Store additional user information in Firestore
    console.log('Storing user profile in Firestore.');
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: email,
      createdAt: new Date(),
      // Removed emailVerified field as it's no longer necessary
    });
    console.log('User profile stored successfully in Firestore.');

    return user;
  } catch (error) {
    console.error('Error registering with email:', error);
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
    console.log(`Sending password reset email to: ${email}`);
    // Trim and lowercase the email
    email = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format during password reset.');
      throw new Error('Please enter a valid email address.');
    }

    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
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
    console.log('Signing out user.');
    await signOut(auth);
    console.log('User signed out successfully.');
  } catch (error) {
    console.error('Error signing out:', error);
    alert(`Error signing out: ${error.message}`);
    throw error;
  }
};

export { signInWithEmail, registerWithEmail, logout, resetPassword };