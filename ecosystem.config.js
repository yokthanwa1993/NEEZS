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
        EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
        EXPO_PUBLIC_OAUTH_REDIRECT_PATH: process.env.EXPO_PUBLIC_OAUTH_REDIRECT_PATH || 'auth-callback',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
    },
  ],
};

