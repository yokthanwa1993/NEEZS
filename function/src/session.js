import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.APP_JWT_SECRET || 'dev-secret-change-me';
const REFRESH_SECRET = process.env.APP_JWT_REFRESH_SECRET || ACCESS_SECRET + '-refresh';
const ACCESS_TTL = process.env.APP_JWT_TTL || '15m';
const REFRESH_TTL = process.env.APP_REFRESH_TTL || '30d';

export function signAccessToken(payload, opts = {}) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL, ...opts });
}

export function signRefreshToken(payload, opts = {}) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL, ...opts });
}

export function verifyAccess(token) {
  try { return jwt.verify(token, ACCESS_SECRET); } catch { return null; }
}

export function verifyRefresh(token) {
  try { return jwt.verify(token, REFRESH_SECRET); } catch { return null; }
}

export function sessionMiddleware(req, res, next) {
  const auth = req.header('Authorization') || '';
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return res.status(401).json({ error: 'Missing Authorization' });
  const decoded = verifyAccess(m[1]);
  if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });
  req.session = decoded;
  next();
}
