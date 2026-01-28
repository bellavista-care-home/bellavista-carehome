
import * as authService from './authService';
import { API_URL } from '../config/apiConfig';

export async function fetchHomes() {
  try {
    const res = await fetch(`${API_URL}/homes`);
    if (!res.ok) throw new Error('Failed to fetch homes');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching homes:', error);
    return [];
  }
}

export async function fetchHome(id) {
  try {
    // Check session storage first
    const cached = sessionStorage.getItem(`home_${id}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const res = await fetch(`${API_URL}/homes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch home');
    const data = await res.json();
    
    // Cache the result
    sessionStorage.setItem(`home_${id}`, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Error fetching home:', error);
    return null;
  }
}

export async function createHome(data) {
  const res = await fetch(`${API_URL}/homes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create home');
  return await res.json();
}

export async function updateHome(id, data) {
  const res = await fetch(`${API_URL}/homes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update home');
  return await res.json();
}

export async function deleteHome(id) {
  const res = await fetch(`${API_URL}/homes/${id}`, {
    method: 'DELETE',
    headers: authService.getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to delete home');
  return await res.json();
}
