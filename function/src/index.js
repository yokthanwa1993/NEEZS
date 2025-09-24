import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import https from 'https';
import fs from 'fs';
import { ensureAdmin } from './firebaseAdmin.js';
import { authMiddleware } from './auth.js';
import { sessionMiddleware, signAccessToken, signRefreshToken, verifyRefresh } from './session.js';
import { OAuth2Client } from 'google-auth-library';

const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY;

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // mobile apps / curl
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('CORS origin not allowed: ' + origin), false);
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: Number(process.env.RATE_LIMIT_MAX || 1000) }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Email/password login via Firebase Auth REST → issues access/refresh tokens
app.post('/auth/login', async (req, res) => {
  try {
    if (!FIREBASE_WEB_API_KEY) return res.status(500).json({ error: 'FIREBASE_WEB_API_KEY not set' });
    const { email, password, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(401).json({ error: data.error?.message || 'Invalid credentials' });
    }

    const uid = data.localId;
    // ensure role document server-side
    try {
      const admin = ensureAdmin();
      const ref = admin.firestore().collection('users').doc(uid);
      await ref.set({
        roles: role ? { [role]: true } : {},
        lastRole: role || null,
        email: data.email || null,
        displayName: data.displayName || null,
        photoURL: data.photoUrl || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch {}

    const access_token = signAccessToken({ uid, email: data.email, role: role || null });
    const refresh_token = signRefreshToken({ uid, email: data.email, role: role || null });
    return res.json({ access_token, refresh_token, user: { uid, email: data.email, displayName: data.displayName || null, photoURL: data.photoUrl || null } });
  } catch (err) {
    console.error('auth/login failed:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh access token
app.post('/auth/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body || {};
    const decoded = verifyRefresh(refresh_token || '');
    if (!decoded) return res.status(401).json({ error: 'Invalid refresh token' });
    const access_token = signAccessToken({ uid: decoded.uid, email: decoded.email, role: decoded.role || null });
    return res.json({ access_token });
  } catch (err) {
    return res.status(500).json({ error: 'Refresh failed' });
  }
});

// Google OAuth 2 (server-side)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const OAUTH_REDIRECT_BASE = process.env.OAUTH_REDIRECT_BASE || '';
const oauthClient = (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) ? new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${OAUTH_REDIRECT_BASE}/auth/google/callback`) : null;

function toBase64Url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}
function fromBase64Url(s) {
  try { return JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); } catch { return {}; }
}

// Start: redirect user to Google and keep role/app_redirect in state
app.get('/auth/google/start', (req, res) => {
  try {
    if (!oauthClient) return res.status(500).send('Google OAuth not configured');
    const { role = 'seeker', app_redirect } = req.query;
    const state = toBase64Url({ role, app_redirect });
    const url = oauthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['openid', 'profile', 'email'],
      state,
    });
    return res.redirect(url);
  } catch (e) {
    return res.status(500).send('Failed to start Google OAuth');
  }
});

// Callback: exchange code -> Google tokens -> Firebase signInWithIdp -> issue app tokens -> redirect back to app
app.get('/auth/google/callback', async (req, res) => {
  try {
    if (!oauthClient) return res.status(500).send('Google OAuth not configured');
    const { code, state: s } = req.query;
    const { role = 'seeker', app_redirect } = fromBase64Url(String(s || ''));
    const { tokens } = await oauthClient.getToken(String(code || ''));
    const idToken = tokens.id_token;
    if (!idToken) return res.status(400).send('Missing Google id_token');

    // Sign-in with Firebase using Google id_token to get localId (uid)
    if (!FIREBASE_WEB_API_KEY) return res.status(500).send('FIREBASE_WEB_API_KEY not set');
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${FIREBASE_WEB_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postBody: `id_token=${idToken}&providerId=google.com`,
        requestUri: 'http://localhost',
        returnIdpCredential: true,
        returnSecureToken: true,
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(401).send('Firebase sign-in failed: ' + (data.error?.message || ''));
    }
    const uid = data.localId;

    // Ensure role in Firestore
    try {
      const admin = ensureAdmin();
      const ref = admin.firestore().collection('users').doc(uid);
      await ref.set({
        roles: role ? { [role]: true } : {},
        lastRole: role || null,
        email: data.email || null,
        displayName: data.displayName || null,
        photoURL: data.photoUrl || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch {}

    // Issue app tokens
    const access_token = signAccessToken({ uid, email: data.email, role: role || null });
    const refresh_token = signRefreshToken({ uid, email: data.email, role: role || null });

    if (app_redirect) {
      const url = `${app_redirect}${app_redirect.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`;
      return res.redirect(url);
    }
    return res.json({ access_token, refresh_token });
  } catch (e) {
    console.error('google callback error', e);
    return res.status(500).send('Google callback failed');
  }
});

// LINE Login (OAuth 2.0 + OIDC)
const LINE_CLIENT_ID = process.env.LINE_CLIENT_ID || process.env.LINE_CHANNEL_ID;
const LINE_CLIENT_SECRET = process.env.LINE_CLIENT_SECRET || process.env.LINE_CHANNEL_SECRET;
const LINE_REDIRECT = `${OAUTH_REDIRECT_BASE || ''}/auth/line/callback`;

function encodeForm(data) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

app.get('/auth/line/start', (req, res) => {
  try {
    if (!LINE_CLIENT_ID || !LINE_CLIENT_SECRET || !OAUTH_REDIRECT_BASE) {
      return res.status(500).send('LINE OAuth not configured');
    }
    const { role = 'seeker', app_redirect } = req.query;
    const nonce = Math.random().toString(36).slice(2);
    const state = toBase64Url({ role, app_redirect, nonce });
    const url = new URL('https://access.line.me/oauth2/v2.1/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', LINE_CLIENT_ID);
    url.searchParams.set('redirect_uri', LINE_REDIRECT);
    url.searchParams.set('scope', 'openid profile email');
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', nonce);
    return res.redirect(url.toString());
  } catch (e) {
    return res.status(500).send('Failed to start LINE OAuth');
  }
});

app.get('/auth/line/callback', async (req, res) => {
  try {
    const code = String(req.query.code || '');
    const s = req.query.state;
    const { role = 'seeker', app_redirect, nonce } = fromBase64Url(String(s || ''));
    if (!code) return res.status(400).send('Missing code');
    if (!LINE_CLIENT_ID || !LINE_CLIENT_SECRET || !OAUTH_REDIRECT_BASE) {
      return res.status(500).send('LINE OAuth not configured');
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForm({
        grant_type: 'authorization_code',
        code,
        client_id: LINE_CLIENT_ID,
        client_secret: LINE_CLIENT_SECRET,
        redirect_uri: LINE_REDIRECT,
      }),
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) return res.status(401).send('LINE token exchange failed');
    const { id_token, access_token } = tokenJson;
    if (!id_token) return res.status(400).send('Missing LINE id_token');

    // Decode id_token (not verifying signature here; recommend to verify in production)
    const payload = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString('utf8'));
    if (nonce && payload.nonce && payload.nonce !== nonce) {
      return res.status(400).send('Invalid nonce');
    }
    const sub = payload.sub; // LINE user ID
    const email = payload.email || null;

    // Get profile for displayName/picture
    let profile = {};
    try {
      const pr = await fetch('https://api.line.me/v2/profile', { headers: { Authorization: `Bearer ${access_token}` } });
      profile = await pr.json();
    } catch {}

    const uid = `line:${sub}`;
    // Ensure role in Firestore
    try {
      const admin = ensureAdmin();
      const ref = admin.firestore().collection('users').doc(uid);
      await ref.set({
        roles: role ? { [role]: true } : {},
        lastRole: role || null,
        email: email,
        displayName: profile?.displayName || null,
        photoURL: profile?.pictureUrl || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch {}

    const access_token_app = signAccessToken({ uid, email, role: role || null });
    const refresh_token_app = signRefreshToken({ uid, email, role: role || null });
    if (app_redirect) {
      const url = `${app_redirect}${app_redirect.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(access_token_app)}&refresh_token=${encodeURIComponent(refresh_token_app)}`;
      return res.redirect(url);
    }
    return res.json({ access_token: access_token_app, refresh_token: refresh_token_app });
  } catch (e) {
    console.error('line callback error', e);
    return res.status(500).send('LINE callback failed');
  }
});
// Example protected route: list users collection
app.get('/api/users', sessionMiddleware, async (req, res) => {
  try {
    const admin = ensureAdmin();
    if (!admin) return res.status(500).json({ error: 'Server not configured' });
    const snap = await admin.firestore().collection('users').limit(20).get();
    const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ users });
  } catch (err) {
    console.error('List users failed:', err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// Example protected route: upsert current user profile
app.post('/api/users', sessionMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const data = req.body || {};
    const admin = ensureAdmin();
    if (!admin) return res.status(500).json({ error: 'Server not configured' });
    await admin.firestore().collection('users').doc(uid).set(data, { merge: true });
    res.status(201).json({ id: uid });
  } catch (err) {
    console.error('Upsert user failed:', err);
    res.status(500).json({ error: 'Failed to upsert user' });
  }
});

// Ensure role for current user and record lastRole
app.post('/api/roles/ensure', sessionMiddleware, async (req, res) => {
  try {
    const { role } = req.body || {};
    if (!role || !['seeker', 'employer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const uid = req.session.uid;
    const admin = ensureAdmin();
    if (!admin) return res.status(500).json({ error: 'Server not configured' });
    const ref = admin.firestore().collection('users').doc(uid);
    await ref.set({
      roles: { [role]: true },
      lastRole: role,
      // For session-based auth we have limited claims; client can upsert later
      email: req.session.email || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    const snap = await ref.get();
    return res.json({ id: uid, data: snap.data() || {} });
  } catch (err) {
    console.error('Ensure role failed:', err);
    res.status(500).json({ error: 'Failed to ensure role' });
  }
});

// Get current user document from users collection
app.get('/api/users/me', sessionMiddleware, async (req, res) => {
  try {
    const uid = req.session.uid;
    const admin = ensureAdmin();
    if (!admin) return res.status(500).json({ error: 'Server not configured' });
    const ref = admin.firestore().collection('users').doc(uid);
    const snap = await ref.get();
    return res.json({ id: uid, data: snap.exists ? snap.data() : null });
  } catch (err) {
    console.error('Get me failed:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

const PORT = process.env.PORT || 3000;
const HTTPS_ENABLED = process.env.HTTPS_ENABLED === '1';
if (HTTPS_ENABLED) {
  try {
    const key = fs.readFileSync(process.env.HTTPS_KEY_PATH);
    const cert = fs.readFileSync(process.env.HTTPS_CERT_PATH);
    https.createServer({ key, cert }, app).listen(PORT, () => {
      console.log(`API (HTTPS) listening on https://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start HTTPS server, falling back to HTTP:', e.message);
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  }
} else {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}
