import admin from '../firebaseAdmin.js';

// Middleware to verify Firebase ID token and attach user info
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Normalize role names to match route middleware expectations
    const rawRole = decodedToken.role || 'buyer';
    const roleMap = { seller: 'merchant', shipping: 'delivery' };
    const normalizedRole = roleMap[rawRole] || rawRole;
    req.user = {
      uid: decodedToken.uid,
      role: normalizedRole
    };
    console.log(`[${new Date().toISOString()}] ✅ Authenticated user uid=${req.user.uid} role=${req.user.role}`);
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
