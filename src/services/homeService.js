
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
    // Check if we're in preview mode - if so, always fetch fresh data
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true' || urlParams.get('nocache');
    
    // Clear any cached data when in preview mode
    if (isPreview) {
      sessionStorage.removeItem(`home_${id}`);
    }

    // Check session storage first - DISABLED for now to ensure fresh data during updates
    // const cached = sessionStorage.getItem(`home_${id}`);
    // if (cached) {
    //   return JSON.parse(cached);
    // }

    // Add cache-busting to ensure fresh data
    const cacheBuster = isPreview ? `?t=${Date.now()}` : '';
    const res = await fetch(`${API_URL}/homes/${id}${cacheBuster}`, {
      cache: isPreview ? 'no-store' : 'default'
    });
    if (!res.ok) throw new Error('Failed to fetch home');
    const data = await res.json();
    
    // Only cache if not in preview mode
    if (!isPreview) {
      sessionStorage.setItem(`home_${id}`, JSON.stringify(data));
    }
    
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
