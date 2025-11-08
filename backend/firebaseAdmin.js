import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const alreadyInitialized = admin.apps.length > 0;
if (!alreadyInitialized) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const hasServiceAccount = projectId && clientEmail && privateKey;
  const isPlaceholder = projectId === 'your-project-id';

  if (hasServiceAccount && !isPlaceholder) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
    });
  } else {
    console.log('Firebase Admin SDK initialized without explicit credentials. This is expected for placeholder credentials or in a GCP environment.');
    admin.initializeApp();
  }
}

export default admin;
