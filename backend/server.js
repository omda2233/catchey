import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import admin from './firebaseAdmin.js';

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

verifyFirestore();

app.get('/', (req, res) => {
  res.send('Backend is live 🚀');
});

const PORT = process.env.PORT || 8080;
const BASE_URL = "https://catchey-copy-copy-production.up.railway.app";
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on ${BASE_URL} (port ${PORT})`);
});
// --- end snippet ---
