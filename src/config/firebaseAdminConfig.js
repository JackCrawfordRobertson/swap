// initializeAdmin.js

import admin from "firebase-admin";
import { getSecrets } from "./secretsManager";

let adminInitialized = false;
let adminServices = {};

export const initializeAdmin = async () => {
  if (adminInitialized) {
    return adminServices;
  }

  const isServer = typeof window === "undefined";
  if (!isServer) {
    throw new Error("Firebase Admin SDK should only be initialized on the server.");
  }

  const secrets = await getSecrets();
  const serviceAccountBase64 =
    process.env.NODE_ENV === "production"
      ? secrets.FIREBASE_SERVICE_ACCOUNT_PROD_BASE64
      : secrets.FIREBASE_SERVICE_ACCOUNT_DEV_BASE64;

  if (!serviceAccountBase64) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.");
  }

  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountBase64, "base64").toString("utf8")
  );

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
    console.log("Firebase Admin initialized successfully.");

    adminServices = {
      admin,
      db: admin.firestore(),
      auth: admin.auth(),
    };
    adminInitialized = true;
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }

  return adminServices;
};

export default initializeAdmin;