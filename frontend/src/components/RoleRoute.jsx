import { Navigate } from 'react-router-dom'

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export default function RoleRoute({ role, children }) {
  const token = localStorage.getItem('token')
  const decoded = token ? decodeToken(token) : null
  if (!decoded || decoded.role !== role) return <Navigate to="/" replace />
  return children
}
