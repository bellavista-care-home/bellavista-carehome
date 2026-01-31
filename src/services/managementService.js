
import { API_URL } from '../config/apiConfig';

const API_BASE = API_URL;

export async function fetchManagementTeam() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/management-team`);
    if (!res.ok) throw new Error('Failed to fetch management team');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createManagementMember(member) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/management-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(member)
    });
    if (!res.ok) throw new Error('Failed to create member');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateManagementMember(id, member) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/management-team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(member)
    });
    if (!res.ok) throw new Error('Failed to update member');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteManagementMember(id) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/management-team/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Failed to delete member');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function seedManagementTeam() {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/management-team/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to seed team');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
