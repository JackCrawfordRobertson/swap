// src/utils/auth.js
import { auth, db } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { createUserRegistrationTemplate, createAdminApprovalTemplate } from "@/utils/email/emailTemplate";
import { sendEmail } from "@/utils/services/emailService";

const allowedDomains = ["aviva.com", "ice-hub.biz", "ya-ya.co.uk", "jack-robertson.co.uk"];

const isAllowedDomain = (email) => {
  const emailDomain = email.split("@")[1]?.toLowerCase();
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
    return userCredential.user;
  } catch (error) {
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('No user found with this email. Please check your email address or register.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password. Please try again.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address format.');
      case 'auth/user-disabled':
        throw new Error('This user has been disabled. Please contact support.');
      case 'auth/invalid-credential':
        throw new Error('Invalid credentials. Please check your login details.');
      default:
        throw new Error('An error occurred during sign-in. Please try again later.');
    }
  }
};

/**
 * Registers a new user with email, password, and username, sending emails to user and admin.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} username - The desired username.
 * @returns {Promise<Object>} - Returns the registration result.
 * @throws {Error} - Throws an error if registration fails.
 */

const registerWithEmail = async (email, password, username) => {
  console.log("Starting registration process");
  try {
    email = email.trim().toLowerCase();
    username = username.trim();
    console.log("Email:", email, "Username:", username);

    if (!isAllowedDomain(email)) {
      console.error("Unauthorized domain:", email);
      throw new Error("Email domain not allowed.");
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) throw new Error("Username already taken.");

    const pendingRef = collection(db, "pendingUsers");
    const userDoc = await addDoc(pendingRef, {
      username,
      email,
      password,
      createdAt: new Date(),
    });
    console.log("User document created in pendingUsers");

    await sendEmail({
      to: email,
      from: "support@ice-hub.biz",
      subject: "Registration Request Received",
      html: createUserRegistrationTemplate({ content: `Welcome, ${username}!` }),
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const approvalLink = `${appUrl}/api/approveUser?userId=${userDoc.id}`;
    const disapprovalLink = `${appUrl}/api/disapproveUser?userId=${userDoc.id}`;
    
    await sendEmail({
      to: "support@ice-hub.biz",
      from: "support@ice-hub.biz",
      subject: "New User Registration Approval Needed",
      html: createAdminApprovalTemplate({ content: `${username} (${email}) requested an account.`, approvalLink, disapprovalLink }),
    });

    return { success: true, message: "Registration request received." };
  } catch (error) {
    console.error("Error during registration:", error.code, error.message);
    throw new Error("An error occurred during registration.");
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
    email = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Please enter a valid email address.");

    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        throw new Error("No user found with this email.");
      case "auth/invalid-email":
        throw new Error("Invalid email address.");
      default:
        throw new Error("An error occurred during password reset. Please try again.");
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
    throw new Error("An error occurred while signing out. Please try again.");
  }
};

export { signInWithEmail, registerWithEmail, logout, resetPassword };