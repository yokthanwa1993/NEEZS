import { apiFetch } from './apiClient';

export async function ensureRole(role) {
  return apiFetch('/api/roles/ensure', { method: 'POST', body: { role } });
}

export async function getMe() {
  return apiFetch('/api/users/me', { method: 'GET' });
}

export async function upsertUser(data) {
  return apiFetch('/api/users', { method: 'POST', body: data });
}

export default { ensureRole, getMe, upsertUser };

