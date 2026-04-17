export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Works like fetch() but automatically adds the Authorization header
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token')
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  return fetch(fullUrl, { ...options, headers })
}
