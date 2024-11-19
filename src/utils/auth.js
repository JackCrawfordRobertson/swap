// src/utils/auth.js

import { auth, db } from "../config/firebaseConfig";
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, addDoc, getDocs, collection, query, where } from "firebase/firestore";
import { createUserRegistrationTemplate, createAdminApprovalTemplate } from "@/utils/email/emailTemplate";
import { sendEmail } from "@/utils/services/emailService";

// Allowed email domains
const allowedDomains = ["aviva.com", "ice-hub.biz", "ya-ya.co.uk", "jack-robertson.co.uk"];

/**
 * Determines whether the app is running in production or development
 * and sets the correct app URL based on the environment.
 */
const isProduction = process.env.NODE_ENV === 'production';
const appUrl = isProduction
  ? process.env.NEXT_PUBLIC_APP_URL_PROD
  : process.env.NEXT_PUBLIC_APP_URL_DEV;

/**
 * Checks if the provided email has an allowed domain.
 * @param {string} email - The user's email address.
 * @returns {boolean} - Returns true if the domain is allowed, false otherwise.
 */
const isAllowedDomain = (email) => {
  const emailDomain = email.split("@")[1]?.trim().toLowerCase();
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
  try {
    email = email.trim().toLowerCase();
    username = username.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Please enter a valid email address.");

    // Check for allowed domains
    if (!isAllowedDomain(email)) throw new Error("Email domain not allowed.");

    // Check if username already exists in Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) throw new Error("Username already taken. Please choose another.");

    // Add user data to the pendingUsers collection
    const pendingRef = collection(db, "pendingUsers");
    const userDoc = await addDoc(pendingRef, {
      username,
      email,
      password, // Note: Hash in production for security
      createdAt: new Date(),
    });

    // Send confirmation email to user
    const userContent = `
      <p>Thank you for registering, <b>${username}</b>!</p>
      <p>Your request is currently pending approval. Our team is reviewing your information to ensure everything is in order.</p>
      <p>We’ll be in touch soon with an update on the status of your account. If you have any questions in the meantime, feel free to reach out to our support team.</p>`;
    await sendEmail({
      to: email,
      from: "support@ice-hub.biz",
      subject: "Registration Request Received",
      html: createUserRegistrationTemplate({ content: userContent }),
    });

    // Send admin approval request email with approval/disapproval links
    const approvalLink = `${appUrl}/api/approveUser?userId=${userDoc.id}`;
    const disapprovalLink = `${appUrl}/api/disapproveUser?userId=${userDoc.id}`;
    const adminContent = `User <b>${username}</b> <br><br> <b>(${email})</b> has requested an account.`;

    await sendEmail({
      to: "support@ice-hub.biz", // admin email
      from: "support@ice-hub.biz",
      subject: "New User Registration Approval Needed",
      html: createAdminApprovalTemplate({
        content: adminContent,
        approvalLink,
        disapprovalLink,
      }),
    });

    return { success: true, message: "Registration request received." };
  } catch (error) {
    throw new Error("An error occurred during registration. Please try again later.");
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

    // Set up Firebase's action code settings for reset with dynamic URL
    const actionCodeSettings = {
      url: `${appUrl}/reset-password`,
      handleCodeInApp: true,
    };

    // Send the password reset email using Firebase's built-in method
    await sendPasswordResetEmail(auth, email, actionCodeSettings);

    return { success: true, message: "Password reset email sent successfully." };
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