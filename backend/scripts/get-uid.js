import admin from '../firebaseAdmin.js';

// Usage: node backend/scripts/get-uid.js --email merchant@test.com
const args = process.argv.slice(2);
const argMap = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const val = args[i + 1];
  if (key && key.startsWith('--')) argMap[key.replace(/^--/, '')] = val;
}

async function main() {
  const email = argMap.email;
  if (!email) {
    console.error('Usage: --email <email>');
    process.exit(1);
  }
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log(JSON.stringify({ ok: true, email, uid: user.uid }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error fetching user by email:', err.message || err);
    process.exit(2);
  }
}

main();