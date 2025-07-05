import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts'

export function RequireAuth() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/" replace />
}

export function PublicOnly() {
  const { user } = useAuth()
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />
}
