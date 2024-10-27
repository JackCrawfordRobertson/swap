// src/config/firebaseAdminConfig.js

import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // Parse the service account JSON
  const serviceAccount = JSON.parse(serviceAccountString);

  // Replace escaped newline characters in the private key
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://swapp-7f6f8.firebaseio.com', // Replace with your actual database URL
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };