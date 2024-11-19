import admin from 'firebase-admin';

// Decode the Base64-encoded service account key
const serviceAccountBase64 =
  process.env.NODE_ENV === 'production'
    ? process.env.FIREBASE_SERVICE_ACCOUNT_PROD_BASE64
    : process.env.FIREBASE_SERVICE_ACCOUNT_DEV_BASE64;

if (!serviceAccountBase64) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.");
}

// Parse the decoded key into JSON
const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };