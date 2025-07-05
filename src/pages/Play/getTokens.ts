import { toast } from 'react-toastify'
import api from '../../services/api'
import type { Token } from './interfaces'

export async function getTokens() {
  try {
    const response = await api.get<Token[]>('/chartokens')
    return response.data
  } catch (e) {
    console.error('Erro ao carregar as Tokens dos Personagens:', e)
    toast.error('Houve um problema ao carregar as Tokens dos Personagens!')
  }
}
