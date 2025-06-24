/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
} from 'react'

// Interfaces específicas para COMBATE
interface CombatCharacter {
  id: number
  name: string
  level: number
  health: number
  healthNow: number
  race: string
  portrait: string
  baseAttack: number
  fortitude: number
  reflex: number
  will: number
  classes: any[]
  armor: any[]
  weapons: any[]
  equipment: any[]
}

interface CombatStats {
  charInit: number | null
  fortitude: number | null
  reflex: number | null
  will: number | null
  strength: number | null
  maxDex: number | null
  totalCa: number | null
}

interface CombatUI {
  menu: string
  allowDrag: boolean
  showMenu: boolean
}

interface CombatState {
  character: CombatCharacter | null
  tokens: any[]
  stats: CombatStats
  ui: CombatUI
  weapons: any[]
}

interface CombatAction {
  type: string
  payload?: any
}

interface CombatProviderProps {
  children: ReactNode
}

const initialState: CombatState = {
  character: null,
  tokens: [],
  stats: {
    charInit: null,
    fortitude: null,
    reflex: null,
    will: null,
    strength: null,
    maxDex: null,
    totalCa: null,
  },
  ui: {
    menu: 'attack',
    allowDrag: false,
    showMenu: true,
  },
  weapons: [],
}

// Actions específicas para COMBATE
const COMBAT_ACTIONS = {
  SET_CHARACTER: 'SET_CHARACTER',
  SET_TOKENS: 'SET_TOKENS',
  SET_STATS: 'SET_STATS',
  SET_WEAPONS: 'SET_WEAPONS',
  UPDATE_UI: 'UPDATE_UI',
  SET_MENU: 'SET_MENU',
  SET_ALLOW_DRAG: 'SET_ALLOW_DRAG',
  RESET_COMBAT: 'RESET_COMBAT',
} as const

// Reducer para COMBATE
function combatReducer(state: CombatState, action: CombatAction): CombatState {
  switch (action.type) {
    case COMBAT_ACTIONS.SET_CHARACTER:
      return {
        ...state,
        character: action.payload,
      }

    case COMBAT_ACTIONS.SET_TOKENS:
      return {
        ...state,
        tokens: action.payload,
      }

    case COMBAT_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
        },
      }

    case COMBAT_ACTIONS.SET_WEAPONS:
      return {
        ...state,
        weapons: action.payload,
      }

    case COMBAT_ACTIONS.UPDATE_UI:
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload,
        },
      }

    case COMBAT_ACTIONS.SET_MENU:
      return {
        ...state,
        ui: {
          ...state.ui,
          menu: action.payload,
        },
      }

    case COMBAT_ACTIONS.SET_ALLOW_DRAG:
      return {
        ...state,
        ui: {
          ...state.ui,
          allowDrag: action.payload,
        },
      }

    case COMBAT_ACTIONS.RESET_COMBAT:
      return { ...initialState }

    default:
      return state
  }
}

// Contexts para COMBATE
const CombatStateContext = createContext<CombatState | undefined>(undefined)
const CombatDispatchContext = createContext<
  React.Dispatch<CombatAction> | undefined
>(undefined)

// Provider para COMBATE
export function CombatProvider({ children }: CombatProviderProps) {
  const [state, dispatch] = useReducer(combatReducer, initialState)

  const memoizedState = useMemo(() => state, [state])

  return (
    <CombatStateContext.Provider value={memoizedState}>
      <CombatDispatchContext.Provider value={dispatch}>
        {children}
      </CombatDispatchContext.Provider>
    </CombatStateContext.Provider>
  )
}

// Hook para acessar o state do COMBATE
export function useCombatState() {
  const context = useContext(CombatStateContext)
  if (context === undefined) {
    throw new Error('useCombatState deve ser usado dentro de CombatProvider')
  }
  return context
}

// Hook para acessar o dispatch do COMBATE
export function useCombatDispatch() {
  const context = useContext(CombatDispatchContext)
  if (context === undefined) {
    throw new Error('useCombatDispatch deve ser usado dentro de CombatProvider')
  }
  return context
}

// Hook customizado para COMBATE
export function useCombat() {
  const state = useCombatState()
  const dispatch = useCombatDispatch()

  const actions = useMemo(
    () => ({
      setCharacter: (character: CombatCharacter) => {
        dispatch({ type: COMBAT_ACTIONS.SET_CHARACTER, payload: character })
      },

      setTokens: (tokens: any[]) => {
        dispatch({ type: COMBAT_ACTIONS.SET_TOKENS, payload: tokens })
      },

      setStats: (stats: Partial<CombatStats>) => {
        dispatch({ type: COMBAT_ACTIONS.SET_STATS, payload: stats })
      },

      setWeapons: (weapons: any[]) => {
        dispatch({ type: COMBAT_ACTIONS.SET_WEAPONS, payload: weapons })
      },

      setMenu: (menu: string) => {
        dispatch({ type: COMBAT_ACTIONS.SET_MENU, payload: menu })
      },

      setAllowDrag: (allowDrag: boolean) => {
        dispatch({ type: COMBAT_ACTIONS.SET_ALLOW_DRAG, payload: allowDrag })
      },

      updateUI: (uiData: Partial<CombatUI>) => {
        dispatch({ type: COMBAT_ACTIONS.UPDATE_UI, payload: uiData })
      },

      resetCombat: () => {
        dispatch({ type: COMBAT_ACTIONS.RESET_COMBAT })
      },
    }),
    [dispatch]
  )

  return { state, actions }
}

export {
  COMBAT_ACTIONS,
  type CombatCharacter,
  type CombatState,
  type CombatStats,
  type CombatUI,
}
