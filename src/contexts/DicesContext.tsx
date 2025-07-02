/* eslint-disable no-console */

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { toast } from 'react-toastify'

// Tipos
interface DicesState {
  diceType: string | null
  diceSides: number | null
  diceMult: number | null
  diceResult: number[] | null
  diceShow: boolean
  diceRoll: boolean
}

interface DiceData extends Partial<DicesState> {}

interface DicesContextType {
  state: DicesState
  setDiceData: (data: DiceData) => void
}

interface DicesProviderProps {
  children: ReactNode
}

// Estado inicial
const initialState: DicesState = {
  diceType: null,
  diceSides: null,
  diceMult: null,
  diceResult: null,
  diceShow: false,
  diceRoll: false,
}

// Criar contexto
const DicesContext = createContext<DicesContextType | null>(null)

// Provider
export function DicesProvider({ children }: DicesProviderProps) {
  const [state, setState] = useState<DicesState>(initialState)

  const setDiceData = useCallback((data: DiceData) => {
    try {
      setState(prev => ({ ...prev, ...data }))
    } catch (err) {
      toast.error('Houve um erro ao alterar as informações do dado')
    }
  }, [])

  console.log('🚀 ~ DicesProvider ~ AAAAAAA:', state)

  return (
    <DicesContext.Provider value={{ state, setDiceData }}>
      {children}
    </DicesContext.Provider>
  )
}

// Hook personalizado
export function useDices() {
  const context = useContext(DicesContext)
  if (!context) {
    throw new Error('useDices deve ser usado dentro de DicesProvider')
  }
  return context
}
