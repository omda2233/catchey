import admin from '../firebaseAdmin.js';

// Usage: node backend/scripts/create-user.js --email merchant@test.com --password 123456 --name "Merchant User" --role merchant
const args = process.argv.slice(2);
const argMap = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const val = args[i + 1];
  if (key && key.startsWith('--')) argMap[key.replace(/^--/, '')] = val;
}

async function main() {
  const { email, password, name, role } = argMap;
  if (!email || !password || !name || !role) {
    console.error('Usage: --email <email> --password <password> --name <name> --role <merchant|delivery|buyer|admin>');
    process.exit(1);
  }
  try {
    // Create Firebase Auth user
    const user = await admin.auth().createUser({ email, password, displayName: name, emailVerified: true });
    // Create Firestore user doc keyed by UID
    const db = admin.firestore();
    await db.collection('users').doc(user.uid).set({
      email,
      name,
      role,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(JSON.stringify({ ok: true, uid: user.uid, email, role }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error creating user:', err.message || err);
    process.exit(2);
  }
}

main();