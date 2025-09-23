import * as tokenStore from './tokenStore';

const DEFAULT_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

async function getSessionToken() { return tokenStore.getAccessToken(); }

export async function apiFetch(path, { method = 'GET', body, auth: needAuth = true, headers = {} } = {}) {
  const url = `${DEFAULT_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (needAuth) {
    const token = await getSessionToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  });
  clearTimeout(timeout);
  if (res.status === 401 && needAuth) {
    const refresh_token = await tokenStore.getRefreshToken();
    if (refresh_token) {
      try {
        const ctrl2 = new AbortController();
        const t2 = setTimeout(() => ctrl2.abort(), 8000);
        const rr = await fetch(`${DEFAULT_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token }),
          signal: ctrl2.signal,
        });
        clearTimeout(t2);
        const rrData = await rr.json().catch(() => ({}));
        if (rr.ok && rrData?.access_token) {
          await tokenStore.setTokens({ access_token: rrData.access_token });
          finalHeaders.Authorization = `Bearer ${rrData.access_token}`;
          const ctrl3 = new AbortController();
          const t3 = setTimeout(() => ctrl3.abort(), 8000);
          res = await fetch(url, { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined, signal: ctrl3.signal });
          clearTimeout(t3);
        }
      } catch {}
    }
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export default { apiFetch };
