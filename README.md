# NEEZS Job App

A lightweight Expo prototype inspired by JobToday that showcases distinct seeker and employer experiences inside a single application.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the Expo development server:
   ```bash
   npx expo start
   ```
3. Use the Expo Go app or an emulator to open the project. The bottom tab bar lets you switch between the seeker and employer flows.

## App structure

- `App.js` wires up a bottom tab navigator with seeker and employer stacks.
- `src/screens/SeekerScreen.js` lists curated roles with category filters and rich job cards.
- `src/screens/EmployerScreen.js` highlights active postings and featured applicants for quick triage.
- `src/components` contains small presentational pieces such as job and applicant cards.
- `src/shared/data/mockData.js` houses static sample content that can later be replaced with API data.

Feel free to extend the mock data, connect real APIs, or add authentication to build out a production-ready experience.

## Backend function (optional)

This repo includes a lightweight Express backend under `function/` that uses `firebase-admin` for server‑side tasks (e.g., role enforcement, protected reads/writes).

Setup:
- Copy env: `cp function/.env.example function/.env` and fill your Firebase service account fields.
- Start API: `cd function && npm i && npm run dev` (listens on `http://localhost:3000`).
- Point the app to it by setting `EXPO_PUBLIC_API_BASE_URL` in the root `.env` (use your LAN IP or a tunnel URL).

Client flow:
- App signs in with Firebase Auth.
- Fetch ID token via `auth.currentUser.getIdToken()`.
- Call the backend with header `Authorization: Bearer <ID_TOKEN>`.

## Cloudflare Tunnel (expose backend with your domain)

When testing OAuth (Google/LINE) on real devices, expose the local `function/` server with a public domain via Cloudflare Tunnel.

### One‑time setup

1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
2. Login: `cloudflared tunnel login` (opens browser to authorize)
3. Create a tunnel: `cloudflared tunnel create neezs-api`
   - Note the Tunnel ID and credentials JSON path (e.g. `~/.cloudflared/<TUNNEL_ID>.json`).
4. Map your DNS in Cloudflare: `cloudflared tunnel route dns neezs-api api.yourdomain.com`
5. Copy `cloudflared/config.example.yml` → `cloudflared/config.yml`, then edit:
   - `tunnel: <TUNNEL_ID>`
   - `credentials-file: <ABSOLUTE_PATH_TO_CREDENTIALS_JSON>`
   - `hostname: api.yourdomain.com`

### Run with PM2

`ecosystem.config.js` already defines:
- `neezs-backend` (Express on :3000)
- `neezs-tunnel` (cloudflared using `cloudflared/config.yml`)

Run both:

```bash
pm2 start ecosystem.config.js
pm2 logs
```

### Point the app and OAuth providers to your domain

Root `.env` (app):

```
EXPO_PUBLIC_API_BASE_URL=https://api.yourdomain.com
EXPO_PUBLIC_OAUTH_REDIRECT_PATH=auth-callback
```

`function/.env` (server):

```
OAUTH_REDIRECT_BASE=https://api.yourdomain.com
```

Authorized Redirect URIs:
- Google: `https://api.yourdomain.com/auth/google/callback`
- LINE: `https://api.yourdomain.com/auth/line/callback`
