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

The API listens on `http://localhost:3000` by default.

## Endpoints (v1)

- `GET /health` — health check
- `GET /api/users` — list users collection (requires `Authorization: Bearer <ID_TOKEN>`)
- `POST /api/users` — upsert current user document with body data (requires auth)
- `POST /api/roles/ensure` — ensure the current user has the given role and set `lastRole` (body: `{ role: 'seeker'|'employer' }`)
- `GET /api/users/me` — get current user's document

### Auth (app session tokens)
- `POST /auth/login` — email/password → returns `{ access_token, refresh_token }`
- `POST /auth/refresh` — refresh → `{ access_token }`
- `GET /auth/google/start` — start Google OAuth. Query: `role`, `app_redirect` (deep link e.g. `neezs-job-app://auth-callback`).
- `GET /auth/google/callback` — OAuth callback. Issues tokens and redirects back to `app_redirect` with `?access_token=...&refresh_token=...`.

## Client usage (Expo)

Use `firebase/auth` to sign in, obtain an ID token, then call the backend:

```js
const token = await auth.currentUser.getIdToken();
const res = await fetch('http://localhost:3000/api/users', {
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
- In the app `.env`, set `EXPO_PUBLIC_API_BASE_URL` to your backend URL, e.g. `http://192.168.1.25:3000` for LAN or your tunnel/hosted URL.
- Also set `EXPO_PUBLIC_OAUTH_REDIRECT_PATH=auth-callback` (default).

Server env (.env)
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `FIREBASE_WEB_API_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (OAuth web client)
- `OAUTH_REDIRECT_BASE` (e.g. `http://localhost:3000` or `https://api.example.com`)
- `APP_JWT_SECRET`, `APP_JWT_REFRESH_SECRET` (optional), `APP_JWT_TTL` (default `15m`), `APP_REFRESH_TTL` (default `30d`)
- `ALLOWED_ORIGINS` for CORS
- `HTTPS_ENABLED=1`, `HTTPS_KEY_PATH`, `HTTPS_CERT_PATH` (optional local TLS)
