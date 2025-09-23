import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';
const TOKEN_KEY = 'NEEZS_APP_TOKEN';

async function getSessionToken() {
  try { return await AsyncStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export async function apiFetch(path, { method = 'GET', body, auth: needAuth = true, headers = {} } = {}) {
  const url = `${DEFAULT_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (needAuth) {
    const token = await getSessionToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export default { apiFetch };
