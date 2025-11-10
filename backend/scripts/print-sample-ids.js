import admin from '../firebaseAdmin.js';

// Prints 1 sample document ID from each collection: orders, payments, users, notifications
async function main() {
  const db = admin.firestore();
  const collections = ['orders', 'payments', 'users', 'notifications'];
  const result = {};
  try {
    for (const col of collections) {
      const snap = await db.collection(col).limit(1).get();
      result[col] = snap.empty ? null : snap.docs[0].id;
    }
    console.log(JSON.stringify({ ok: true, samples: result }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error reading Firestore:', err.message || err);
    process.exit(2);
  }
}

main();