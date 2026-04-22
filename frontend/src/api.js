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

  const response = await fetch(fullUrl, { ...options, headers });

  // If the token expired or is invalid, clear auth state and send user to login
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return response;
  }

  return response;
}
