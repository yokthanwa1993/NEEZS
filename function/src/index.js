import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ensureAdmin } from './firebaseAdmin.js';
import { authMiddleware } from './auth.js';
import { sessionMiddleware, signSession } from './session.js';

const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY;

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // mobile apps / curl
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('CORS origin not allowed: ' + origin), false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Email/password login via Firebase Auth REST
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

    const token = signSession({ uid, email: data.email, role: role || null });
    return res.json({ token, user: { uid, email: data.email, displayName: data.displayName || null, photoURL: data.photoUrl || null } });
  } catch (err) {
    console.error('auth/login failed:', err);
    return res.status(500).json({ error: 'Login failed' });
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
