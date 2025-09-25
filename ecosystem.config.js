module.exports = {
  apps: [
    {
      name: 'neezs-backend',
      cwd: 'function',
      script: 'npm',
      args: 'run dev', // uses nodemon for live reload
      env: {
        PORT: process.env.PORT || '3000',
        // Fill the rest from function/.env at runtime via dotenv (the app itself loads dotenv)
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
    },
    {
      name: 'neezs-expo',
      cwd: '.',
      script: 'npm',
      args: 'run start:pm2',
      // Provide the public envs Expo needs at runtime
      env: {
        CI: '1',
        EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
        EXPO_PUBLIC_OAUTH_REDIRECT_PATH: process.env.EXPO_PUBLIC_OAUTH_REDIRECT_PATH || 'auth-callback',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
    },
    {
      name: 'neezs-expo-link',
      cwd: '.',
      script: 'node',
      args: 'scripts/print-expo-link.js',
      env: {
        EXPO_PORT: process.env.EXPO_PORT || '8081',
        // Optionally set EXPO_LAN_HOST to override the LAN IP
      },
      watch: false,
      autorestart: false,
      max_restarts: 10,
    },
    {
      name: 'neezs-tunnel',
      script: 'cloudflared',
      args: 'tunnel --config cloudflared/config.yml run',
      env: {
        // Optionally override backend URL that Expo uses to call APIs
        EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.yourdomain.com',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
