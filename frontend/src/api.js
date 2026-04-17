export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Authenticated fetch: always adds Authorization header if token exists
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(fullUrl, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}