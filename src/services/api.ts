import axios from "axios"

const baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:9600"

const api = axios.create({
  baseURL,
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    // Verificar se existe token no localStorage
    const stored = localStorage.getItem("dvinte:auth")
    if (stored) {
      try {
        const { token } = JSON.parse(stored)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.warn("Erro ao recuperar token do localStorage:", error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado, limpar localStorage e redirecionar
      localStorage.removeItem("dvinte:auth")
      if (window.location.pathname !== '/' && window.location.pathname !== '/signup') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api
