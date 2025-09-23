import * as SecureStore from 'expo-secure-store';
import { authEvents } from './authEvents';

const ACCESS_KEY = 'NEEZS_ACCESS_TOKEN';
const REFRESH_KEY = 'NEEZS_REFRESH_TOKEN';

export async function getAccessToken() {
  try { return await SecureStore.getItemAsync(ACCESS_KEY); } catch { return null; }
}

export async function getRefreshToken() {
  try { return await SecureStore.getItemAsync(REFRESH_KEY); } catch { return null; }
}

export async function setAccessToken(token) {
  if (token) await SecureStore.setItemAsync(ACCESS_KEY, token);
  authEvents.emit('changed', { token, action: 'set-access' });
}

export async function setRefreshToken(token) {
  if (token) await SecureStore.setItemAsync(REFRESH_KEY, token);
}

export async function setTokens({ access_token, refresh_token }) {
  if (access_token) await SecureStore.setItemAsync(ACCESS_KEY, access_token);
  if (refresh_token) await SecureStore.setItemAsync(REFRESH_KEY, refresh_token);
  authEvents.emit('changed', { token: access_token, action: 'set-tokens' });
}

export async function clearTokens() {
  try { await SecureStore.deleteItemAsync(ACCESS_KEY); } catch {}
  try { await SecureStore.deleteItemAsync(REFRESH_KEY); } catch {}
  authEvents.emit('changed', { token: null, action: 'clear' });
}

export default { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, setTokens, clearTokens };

