const VITE = import.meta.env.VITE_API_BASE_URL;
const API_BASE = import.meta.env.PROD
  ? (VITE && /^https?:\/\//.test(VITE) ? VITE : 'http://bellavista-backend-env.eba-7zhec9xm.eu-west-2.elasticbeanstalk.com/api')
  : (VITE || 'http://localhost:8000/api');

export const fetchFaqs = async () => {
  const res = await fetch(`${API_BASE}/faqs`);
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
};

export const createFaq = async (faq) => {
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faq)
  });
  if (!res.ok) throw new Error('Failed to create FAQ');
  return res.json();
};

export const deleteFaq = async (id) => {
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete FAQ');
  return res.json();
};
