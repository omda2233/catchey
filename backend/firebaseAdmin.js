import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin';

const alreadyInitialized = admin.apps.length > 0;
if (!alreadyInitialized) {
  const hasServiceAccount = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;
  if (hasServiceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
    });
  } else {
    admin.initializeApp();
  }
}

export default admin;
