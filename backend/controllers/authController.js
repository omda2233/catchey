import admin from '../firebaseAdmin.js';
import logger from '../utils/logger.js';

const db = admin.firestore();

const ALLOWED_ROLES = ['buyer', 'merchant', 'delivery', 'admin'];

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const userRecord = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    const userDoc = {
      uid: userRecord.uid,
      email,
      role,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('users').doc(userRecord.uid).set(userDoc);

    try { await logger.info('User Registered', { uid: userRecord.uid, email, role }); } catch (_) {}

    return res.status(201).json({ uid: userRecord.uid, email, role });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'idToken required' });
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const role = decoded.role || 'buyer';

    const userSnap = await db.collection('users').doc(uid).get();
    const profile = userSnap.exists ? userSnap.data() : { uid, role };

    try { await logger.info('User Login', { uid, role }); } catch (_) {}

    return res.status(200).json({ uid, role, email: profile.email || decoded.email || null, profile });
  } catch (err) {
    console.error('Login error', err);
    return res.status(401).json({ error: 'Invalid idToken' });
  }
};

export default { register, login };
