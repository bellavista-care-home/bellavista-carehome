
import { API_URL } from '../config/apiConfig';
import * as authService from './authService';

const API_BASE = API_URL;

export async function fetchUsers() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: authService.getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createUser(userData) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create user');
  }
  return await res.json();
}

export async function updateUser(id, userData) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(userData)
  });
  if (!res.ok) throw new Error('Failed to update user');
  return await res.json();
}

export async function deleteUser(id) {
  if (!API_BASE) return false;
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: authService.getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
}
