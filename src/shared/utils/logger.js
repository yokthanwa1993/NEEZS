import * as FileSystem from 'expo-file-system';

const LOG_DIR = FileSystem.documentDirectory + 'logs/';
let logFile = null;
let initialized = false;
const queue = [];
let flushing = false;

async function ensureFile() {
  if (!logFile) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    logFile = `${LOG_DIR}app-${ts}.log`;
  }
  try {
    const dir = FileSystem.Directory.from(LOG_DIR);
    if (!(await dir.exists())) {
      await dir.create(true);
    }
  } catch {}
  return logFile;
}

async function flush() {
  if (flushing || queue.length === 0) return;
  flushing = true;
  try {
    const file = await ensureFile();
    const chunk = queue.splice(0, queue.length).join('');
    await FileSystem.writeAsStringAsync(file, chunk, { encoding: FileSystem.EncodingType.UTF8, append: true });
  } catch {}
  flushing = false;
}

function format(level, args) {
  let msg = '';
  try {
    const ts = new Date().toISOString();
    const text = args.map((a) => {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    }).join(' ');
    msg = `${ts} [${level}] ${text}\n`;
  } catch { msg = `[${level}] log error\n`; }
  return msg;
}

export function initLogger({ enable = true } = {}) {
  if (initialized || !enable) return;
  initialized = true;
  const original = { log: console.log, warn: console.warn, error: console.error, info: console.info }; 

  ['log', 'warn', 'error', 'info'].forEach((level) => {
    const orig = original[level];
    console[level] = (...args) => {
      try {
        queue.push(format(level, args));
        flush();
      } catch {}
      try { orig.apply(console, args); } catch {}
    };
  });
}

export async function getCurrentLogFile() {
  await ensureFile();
  return logFile;
}

export default initLogger;

