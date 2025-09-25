// Print only the Expo dev link (exp://...) to PM2 logs.
// No QR code, no waiting; best effort to detect port.

const fs = require('fs');
const os = require('os');
const path = require('path');

function getLanIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal && !String(iface.address).startsWith('169.254.')) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function detectPort() {
  // priority: env -> parse expo pm2 log -> default 8081
  const envPort = process.env.EXPO_PORT && String(process.env.EXPO_PORT).trim();
  if (envPort && /^\d+$/.test(envPort)) return Number(envPort);

  try {
    const logPath = path.join(os.homedir(), '.pm2', 'logs', 'neezs-expo-out.log');
    const content = fs.readFileSync(logPath, 'utf8');
    // look for "Waiting on http://localhost:PORT"
    let m = content.match(/Waiting on\s+http:\/\/[^:]+:(\d{2,5})/);
    if (m) return Number(m[1]);
    // or "Metro waiting on exp://IP:PORT"
    m = content.match(/exp:\/\/[^:]+:(\d{2,5})/);
    if (m) return Number(m[1]);
  } catch {}
  return 8081;
}

(function main() {
  const port = detectPort();
  const host = process.env.EXPO_LAN_HOST || getLanIp();
  const link = `exp://${host}:${port}`;
  console.log(`[neezs] Expo dev link: ${link}`);
  console.log('[neezs] Tip: set EXPO_LAN_HOST or EXPO_PORT to override.');
})();

