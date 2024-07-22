// src/utils/auth.js
import { auth, provider } from '../config/firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export { signInWithGoogle, logout };
