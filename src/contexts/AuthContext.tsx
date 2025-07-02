/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'
import SpinnerLoad from '../components/SpinnerLoad'

// Interfaces
interface User {
  id: number
  name: string
  email: string
  phone?: string
  city?: string
  state?: string
  is_gm?: boolean
  is_ativo?: boolean
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  signIn: (credentials: { email: string; password: string }) => Promise<void>
  signUp: (data: any) => Promise<void>
  signOut: () => void
  updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Chave para localStorage
const STORAGE_KEY = 'dvinte:auth'

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Restaurar do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const { user, token } = JSON.parse(stored)
      setUser(user)
      setToken(token)
      if (token) api.defaults.headers.Authorization = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  // Persistir no localStorage sempre que mudar
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user, token])

  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true)
    try {
      const response = await api.post('sessions', { email, password })
      const { token, user } = response.data
      setUser(user)
      setToken(token)
      api.defaults.headers.Authorization = `Bearer ${token}`
      window.location.href = '/dashboard'
    } catch (err) {
      toast.error('Falha na autenticação, verifique seus dados')
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async data => {
    setLoading(true)
    try {
      await api.post('users', { ...data, is_ativo: true })
      toast.success('Cadastro realizado com sucesso!')
      window.location.href = '/'
    } catch (err) {
      toast.error('Falha no cadastro, verifique seus dados!')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async data => {
    setLoading(true)
    try {
      const response = await api.put('users', data)
      setUser(response.data)
      toast.success('Perfil atualizado com sucesso!')
    } catch (err) {
      toast.error('Houve um erro ao atualizar o Perfil')
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    setToken(null)
    delete api.defaults.headers.Authorization
    window.location.href = '/'
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, token, loading, signIn, signUp, signOut, updateProfile]
  )

  if (loading) {
    return <SpinnerLoad />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hooks para acessar state e dispatch
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export { type User }
