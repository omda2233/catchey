import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import admin from './firebaseAdmin.js';

const PORT = process.env.PORT || 3000;

async function verifyFirestore() {
  try {
    const db = admin.firestore();
    const ref = db.collection('_meta').doc('startup');
    await ref.set({ lastStart: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    await ref.get();
    console.log('✅ Firestore connection verified');
  } catch (err) {
    console.error('❌ Firestore connection failed', err);
  }
}

verifyFirestore().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
