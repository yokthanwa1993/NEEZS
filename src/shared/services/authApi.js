import { apiFetch } from './apiClient';
import * as tokenStore from './tokenStore';


export async function loginWithEmail({ email, password, role }) {
  const res = await apiFetch('/auth/login', { method: 'POST', body: { email, password, role }, auth: false });
  await tokenStore.setTokens({ access_token: res.access_token, refresh_token: res.refresh_token });
  return res;
}

export async function logout() {
  await tokenStore.clearTokens();
}

export async function getToken() {
  return tokenStore.getAccessToken();
}

export async function getRefreshToken() {
  return tokenStore.getRefreshToken();
}

export async function setTokens({ access_token, refresh_token }) {
  await tokenStore.setTokens({ access_token, refresh_token });
}

export default { loginWithEmail, logout, getToken };
