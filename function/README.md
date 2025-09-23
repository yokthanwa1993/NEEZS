# NEEZS Backend (function)

A lightweight Express server using Firebase Admin for protected APIs.

## Setup

1) Create `.env` in `function/` from `.env.example`:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (use quotes; replace `\\n` with actual newlines not required, the code handles both)
- Optional: `ALLOWED_ORIGINS`, `PORT`

You can obtain these from a Firebase service account key (IAM & Admin → Service Accounts → Generate new private key). Do NOT commit the key.

2) Install dependencies and run locally:

```bash
cd function
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default.

## Endpoints (v1)

- `GET /health` — health check
- `GET /api/users` — list users collection (requires `Authorization: Bearer <ID_TOKEN>`)
- `POST /api/users` — upsert current user document with body data (requires auth)
- `POST /api/roles/ensure` — ensure the current user has the given role and set `lastRole` (body: `{ role: 'seeker'|'employer' }`)
- `GET /api/users/me` — get current user's document

## Client usage (Expo)

Use `firebase/auth` to sign in, obtain an ID token, then call the backend:

```js
const token = await auth.currentUser.getIdToken();
const res = await fetch('http://localhost:4000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ displayName: 'Alice' }),
});
```

When using a device/emulator, replace `localhost` with your machine IP.

Expo client config
- In the app `.env`, set `EXPO_PUBLIC_API_BASE_URL` to your backend URL, e.g. `http://192.168.1.25:4000` for LAN or your tunnel/hosted URL.
