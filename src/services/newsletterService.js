import * as authService from './authService';
import { API_URL } from '../config/apiConfig';

const API_BASE = API_URL;

// ============================================================
// PUBLIC: Fetch newsletters
// ============================================================

export async function fetchNewsletters(filters = {}) {
  if (!API_BASE) return [];
  try {
    const params = new URLSearchParams();
    if (filters.homeId) params.set('homeId', filters.homeId);
    if (filters.month) params.set('month', filters.month);
    if (filters.year) params.set('year', filters.year);

    const url = `${API_BASE}/newsletters${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch newsletters');
    return await res.json();
  } catch (e) {
    console.error('Error fetching newsletters:', e);
    return [];
  }
}

export async function fetchNewsletterById(id) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/newsletters/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Error fetching newsletter:', e);
    return null;
  }
}

// ============================================================
// PUBLIC: Subscribe to newsletter
// ============================================================

export async function subscribeToNewsletter({ email, name, homeId }) {
  if (!API_BASE) throw new Error('API not configured');
  const res = await fetch(`${API_BASE}/newsletter-subscribers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, homeId }),
  });
  const data = await res.json();
  if (!res.ok && res.status !== 200) throw new Error(data.error || 'Subscription failed');
  return data;
}

export async function unsubscribeFromNewsletter(subscriberId) {
  if (!API_BASE) throw new Error('API not configured');
  const res = await fetch(`${API_BASE}/newsletter-subscribers/unsubscribe/${subscriberId}`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unsubscribe failed');
  return data;
}

// ============================================================
// ADMIN: Create / Update / Delete newsletters
// ============================================================

export async function createNewsletter(formData) {
  if (!API_BASE) throw new Error('API not configured');
  const token = authService.getToken ? authService.getToken() : localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/newsletters`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData, // FormData with file, title, month, year, etc.
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create newsletter');
  return data;
}

export async function updateNewsletter(id, formData) {
  if (!API_BASE) throw new Error('API not configured');
  const token = authService.getToken ? authService.getToken() : localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/newsletters/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update newsletter');
  return data;
}

export async function deleteNewsletter(id) {
  if (!API_BASE) throw new Error('API not configured');
  const token = authService.getToken ? authService.getToken() : localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/newsletters/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete newsletter');
  return data;
}

// ============================================================
// ADMIN: Manage subscribers
// ============================================================

export async function fetchSubscribers() {
  if (!API_BASE) return [];
  const token = authService.getToken ? authService.getToken() : localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/newsletter-subscribers`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) return [];
  return await res.json();
}

export async function deleteSubscriber(id) {
  if (!API_BASE) throw new Error('API not configured');
  const token = authService.getToken ? authService.getToken() : localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/newsletter-subscribers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete subscriber');
  return data;
}
