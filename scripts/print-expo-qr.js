// Prints a QR code for Expo dev server into PM2 logs.
// It waits for Metro (8081) to be available, then prints an ASCII QR
// that you can scan with Expo Go on your phone.

const os = require('os');
const net = require('net');
const qrcode = require('qrcode-terminal');

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

function waitForPort(port, host = '127.0.0.1', { timeoutMs = 30000, intervalMs = 500 } = {}) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const socket = net.createConnection({ host, port }, () => {
        socket.end();
        resolve(true);
      });
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) return reject(new Error('timeout'));
        setTimeout(tryOnce, intervalMs);
      });
    };
    tryOnce();
  });
}

(async () => {
  const metroHost = '127.0.0.1';
  const port = Number(process.env.EXPO_PORT || 8081);
  const lan = process.env.EXPO_LAN_HOST || getLanIp();
  const link = `exp://${lan}:${port}`;
  try {
    console.log(`[neezs] Waiting for Metro on ${metroHost}:${port} ...`);
    await waitForPort(port, metroHost, { timeoutMs: 60000, intervalMs: 800 });
    console.log(`[neezs] Expo dev link: ${link}`);
    console.log('[neezs] Scan this QR with Expo Go');
    qrcode.generate(link, { small: true });
    console.log('[neezs] If scanning fails on device, ensure phone and PC are on the same LAN, or run Expo in tunnel mode.');
  } catch (e) {
    console.log(`[neezs] Metro not detected on ${metroHost}:${port} (timed out). Will still print QR for LAN link.`);
    console.log(`[neezs] Expo dev link (may not be ready): ${link}`);
    qrcode.generate(link, { small: true });
  }
})();

