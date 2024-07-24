// src/utils/auth.js
import { auth, provider } from '../config/firebaseConfig';
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error.message);
    throw error;
  }
};

const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email: ", error.message);
    throw error;
  }
};

const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering with email: ", error.message);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already in use');
    } else {
      throw error;
    }
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error.message);
    alert(`Error signing out: ${error.message}`);
  }
};

export { signInWithGoogle, signInWithEmail, registerWithEmail, logout };
