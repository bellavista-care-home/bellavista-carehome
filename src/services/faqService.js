import * as authService from './authService';

// Use relative paths for all requests - Vite proxy will route to appropriate backend
const API_BASE = '/api';

export const fetchFaqs = async () => {
  const res = await fetch(`${API_BASE}/faqs`);
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
};

export const createFaq = async (faq) => {
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    },
    body: JSON.stringify(faq)
  });
  if (!res.ok) throw new Error('Failed to create FAQ');
  return res.json();
};

export const deleteFaq = async (id) => {
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'DELETE',
    headers: authService.getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to delete FAQ');
  return res.json();
};
