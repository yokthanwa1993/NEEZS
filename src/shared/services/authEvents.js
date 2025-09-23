// Lightweight event hub for React Native (no Node 'events' dependency)
const listeners = new Set();

export const authEvents = {
  on(event, cb) {
    if (event !== 'changed' || typeof cb !== 'function') return;
    listeners.add(cb);
  },
  off(event, cb) {
    if (event !== 'changed' || typeof cb !== 'function') return;
    listeners.delete(cb);
  },
  emit(event, payload) {
    if (event !== 'changed') return;
    // Copy to avoid mutation issues during iteration
    [...listeners].forEach((fn) => {
      try { fn(payload); } catch {}
    });
  },
};

export default authEvents;
