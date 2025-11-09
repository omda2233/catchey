import dotenv from 'dotenv';
dotenv.config();
import admin from '../firebaseAdmin.js';
import axios from 'axios';

// Prefer env, fallback to inline key (set from user input)
const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || 'AIzaSyA1ddznB36_r6WIV-u1m_-aIH0HzdiFckE';

async function signInWithPassword(email, password) {
  if (!FIREBASE_WEB_API_KEY) {
    console.error('Missing FIREBASE_WEB_API_KEY. Set it in .env or inline.');
    return null;
  }
  try {
    const res = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
    return res.data; // { idToken, refreshToken, localId, expiresIn }
  } catch (error) {
    console.error('Error signInWithPassword:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function signInWithUid(uid) {
  if (!FIREBASE_WEB_API_KEY) {
    console.error('Missing FIREBASE_WEB_API_KEY. Set it in .env or inline.');
    return null;
  }
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    const res = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_WEB_API_KEY}`,
      {
        token: customToken,
        returnSecureToken: true,
      }
    );
    return res.data; // { idToken, refreshToken, localId, expiresIn }
  } catch (error) {
    console.error('Error signInWithUid:', error.response ? error.response.data : error.message);
    return null;
  }
}

// CLI usage:
// node scripts/generate-token.js --email buyer@test.com --password 123456
// node scripts/generate-token.js --uid <UID>
const args = process.argv.slice(2);
const argMap = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const val = args[i + 1];
  if (key && key.startsWith('--')) argMap[key.replace(/^--/, '')] = val;
}

(async () => {
  let result = null;
  if (argMap.uid) {
    result = await signInWithUid(argMap.uid);
  } else if (argMap.email && argMap.password) {
    result = await signInWithPassword(argMap.email, argMap.password);
  } else {
    console.error('Usage: --email <email> --password <password> OR --uid <UID>');
    process.exit(1);
  }

  if (result) {
    console.log(JSON.stringify({
      ok: true,
      email: argMap.email || null,
      uid: result.localId,
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    }, null, 2));
    process.exit(0);
  } else {
    process.exit(2);
  }
})();