import * as authService from './authService';
import { API_URL } from '../config/apiConfig';

// Use relative paths for all requests - Vite proxy will route to appropriate backend
const API_BASE = API_URL;

export async function fetchVacancies() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/vacancies`);
    if (!res.ok) throw new Error('Failed to fetch vacancies');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createVacancy(formData) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/vacancies`, {
    method: 'POST',
    headers: authService.getAuthHeader(),
    body: formData
  });
  if (!res.ok) throw new Error('Failed to create vacancy');
  return await res.json();
}

export async function updateVacancy(id, formData) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/vacancies/${id}`, {
    method: 'PUT',
    headers: authService.getAuthHeader(),
    body: formData
  });
  if (!res.ok) throw new Error('Failed to update vacancy');
  return await res.json();
}

export async function deleteVacancy(id) {
  if (!API_BASE) return false;
  const res = await fetch(`${API_BASE}/vacancies/${id}`, {
    method: 'DELETE',
    headers: authService.getAuthHeader()
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

export async function fetchApplications() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/applications`, {
      headers: authService.getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function applyForJob(formData) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/apply`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}
