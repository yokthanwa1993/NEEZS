import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from './apiClient';

const TOKEN_KEY = 'NEEZS_APP_TOKEN';

export async function loginWithEmail({ email, password, role }) {
  const res = await apiFetch('/auth/login', { method: 'POST', body: { email, password, role }, auth: false });
  await AsyncStorage.setItem(TOKEN_KEY, res.token);
  return res;
}

export async function logout() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export default { loginWithEmail, logout, getToken };

