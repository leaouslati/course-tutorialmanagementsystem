export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Base without /api suffix — authFetch callers already include /api in their paths
const _BASE = API_URL.replace(/\/api$/, '');

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const fullUrl = url.startsWith('http') ? url : `${_BASE}${url}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(fullUrl, { ...options, headers });
}