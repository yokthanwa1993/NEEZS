import { ensureAdmin } from './firebaseAdmin.js';
import { verifyAccess } from './session.js';

export async function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: 'Missing Authorization Bearer token' });
  }
  const idToken = match[1];

  try {
    const admin = ensureAdmin();
    if (!admin) {
      return res.status(500).json({ error: 'Server auth not configured' });
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    // Fallback: support legacy app JWTs to avoid lockout during migration
    const legacy = verifyAccess(idToken);
    if (legacy) {
      req.user = legacy; // { uid, email, role? }
      return next();
    }
    console.error('verifyIdToken failed:', err?.message || err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
