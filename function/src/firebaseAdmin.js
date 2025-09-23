import admin from 'firebase-admin';

let initialized = false;

export function ensureAdmin() {
  if (initialized) return admin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null; // not configured yet
  }

  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const credential = admin.credential.cert({ projectId, clientEmail, privateKey });
  admin.initializeApp({ credential });
  initialized = true;
  return admin;
}

export function isAdminReady() {
  return initialized;
}

