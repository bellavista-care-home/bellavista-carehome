import { API_URL } from '../config/apiConfig';
import * as authService from './authService';

const API_BASE = API_URL;

export async function submitReview(payload) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error('Failed to submit review');
  }

  return res.json();
}

export async function fetchReviews(params = {}) {
  if (!API_BASE) return [];
  const query = new URLSearchParams();
  if (params.location) {
    query.set('location', params.location);
  }
  const url = query.toString() ? `${API_BASE}/reviews?${query.toString()}` : `${API_BASE}/reviews`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (res.status === 401 || res.status === 403) {
    console.warn('Unauthorized to fetch reviews. Returning empty list.');
    return [];
  }

  if (!res.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return res.json();
}

export async function deleteReview(id) {
  if (!API_BASE) return false;
  const res = await fetch(`${API_BASE}/reviews/${id}`, {
    method: 'DELETE',
    headers: authService.getAuthHeader()
  });
  if (!res.ok) {
    throw new Error('Failed to delete review');
  }
  return true;
}

export async function importGoogleReviews(placeId, locationName) {
  if (!API_BASE) return false;
  const res = await fetch(`${API_BASE}/reviews/import-google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify({ place_id: placeId, location_name: locationName })
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to import Google reviews');
  }
  
  return res.json();
}
