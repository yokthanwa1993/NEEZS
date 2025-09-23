import jwt from 'jsonwebtoken';

const SECRET = process.env.APP_JWT_SECRET || 'dev-secret-change-me';
const DEFAULT_EXPIRES_IN = process.env.APP_JWT_TTL || '7d';

export function signSession(payload, opts = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: DEFAULT_EXPIRES_IN, ...opts });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

export function sessionMiddleware(req, res, next) {
  const auth = req.header('Authorization') || '';
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return res.status(401).json({ error: 'Missing Authorization' });
  const decoded = verifySession(m[1]);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });
  req.session = decoded;
  next();
}

