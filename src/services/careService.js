import * as authService from './authService';
import { API_URL } from '../config/apiConfig';

export async function fetchCareServices() {
  try {
    const res = await fetch(`${API_URL}/care-services`);
    if (!res.ok) throw new Error('Failed to fetch care services');
    return await res.json();
  } catch (error) {
    console.error('Error fetching care services:', error);
    return [];
  }
}

export async function createCareService(data) {
  const res = await fetch(`${API_URL}/care-services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create care service');
  return await res.json();
}

export async function updateCareService(id, data) {
  const res = await fetch(`${API_URL}/care-services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update care service');
  return await res.json();
}

export async function deleteCareService(id) {
  const res = await fetch(`${API_URL}/care-services/${id}`, {
    method: 'DELETE',
    headers: authService.getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to delete care service');
  return await res.json();
}
