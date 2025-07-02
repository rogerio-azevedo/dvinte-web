/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
  useEffect,
} from 'react'

// Interfaces
interface MenuState {
  chatMenu: boolean | null
  fogLevel: number
  eraserSize: number
  fogPersist: any[]
}

interface MenuAction {
  type: string
  payload?: any
}

interface MenuProviderProps {
  children: ReactNode
}

// Estado inicial
const initialState: MenuState = {
  chatMenu: null,
  fogLevel: 60,
  eraserSize: 60,
  fogPersist: [],
}

// Actions
const MENU_ACTIONS = {
  SHOW_MENU: 'SHOW_MENU',
  FOG_LEVEL: 'FOG_LEVEL',
  ERASER_SIZE: 'ERASER_SIZE',
  FOG_PERSIST: 'FOG_PERSIST',
  FOG_RESET: 'FOG_RESET',
  RESTORE_STATE: 'RESTORE_STATE',
} as const

// Reducer
function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case MENU_ACTIONS.SHOW_MENU:
      return {
        ...state,
        chatMenu: action.payload,
      }

    case MENU_ACTIONS.FOG_LEVEL:
      return {
        ...state,
        fogLevel: action.payload,
      }

    case MENU_ACTIONS.ERASER_SIZE:
      return {
        ...state,
        eraserSize: action.payload,
      }

    case MENU_ACTIONS.FOG_PERSIST:
      return {
        ...state,
        fogPersist: action.payload,
      }

    case MENU_ACTIONS.FOG_RESET:
      return {
        ...state,
        fogPersist: [],
      }

    case MENU_ACTIONS.RESTORE_STATE:
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}

// Contexts
const MenuStateContext = createContext<MenuState | undefined>(undefined)
const MenuDispatchContext = createContext<
  React.Dispatch<MenuAction> | undefined
>(undefined)

// Chave para localStorage
const STORAGE_KEY = 'dvinte:menu'

// Funções de persistência
const saveToStorage = (state: MenuState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Erro ao salvar estado do menu no localStorage:', error)
  }
}

const loadFromStorage = (): Partial<MenuState> | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Erro ao carregar estado do menu do localStorage:', error)
    return null
  }
}

// const clearStorage = () => {
//   try {
//     localStorage.removeItem(STORAGE_KEY)
//   } catch (error) {
//     console.error('Erro ao limpar localStorage do menu:', error)
//   }
// }

// Provider
export function MenuProvider({ children }: MenuProviderProps) {
  const [state, dispatch] = useReducer(menuReducer, initialState)

  // Restaurar estado do localStorage na inicialização
  useEffect(() => {
    const storedState = loadFromStorage()
    if (storedState) {
      dispatch({
        type: MENU_ACTIONS.RESTORE_STATE,
        payload: storedState,
      })
    }
  }, [])

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    saveToStorage(state)
  }, [state])

  const memoizedState = useMemo(() => state, [state])

  return (
    <MenuStateContext.Provider value={memoizedState}>
      <MenuDispatchContext.Provider value={dispatch}>
        {children}
      </MenuDispatchContext.Provider>
    </MenuStateContext.Provider>
  )
}

// Hooks para acessar state e dispatch
export function useMenuState() {
  const context = useContext(MenuStateContext)
  if (context === undefined) {
    throw new Error('useMenuState deve ser usado dentro de MenuProvider')
  }
  return context
}

export function useMenuDispatch() {
  const context = useContext(MenuDispatchContext)
  if (context === undefined) {
    throw new Error('useMenuDispatch deve ser usado dentro de MenuProvider')
  }
  return context
}

// Hook customizado principal
export function useMenu() {
  const state = useMenuState()
  const dispatch = useMenuDispatch()

  const actions = useMemo(
    () => ({
      // Controlar menu de chat
      showMenu: (show: boolean) => {
        dispatch({
          type: MENU_ACTIONS.SHOW_MENU,
          payload: show,
        })
      },

      // Controlar nível da névoa
      setFogLevel: (level: number) => {
        dispatch({
          type: MENU_ACTIONS.FOG_LEVEL,
          payload: level,
        })
      },

      // Controlar tamanho da borracha
      setEraserSize: (size: number) => {
        dispatch({
          type: MENU_ACTIONS.ERASER_SIZE,
          payload: size,
        })
      },

      // Persistir dados da névoa
      setFogPersist: (fogData: any[]) => {
        dispatch({
          type: MENU_ACTIONS.FOG_PERSIST,
          payload: fogData,
        })
      },

      // Resetar névoa
      resetFog: () => {
        dispatch({
          type: MENU_ACTIONS.FOG_RESET,
        })
      },
    }),
    [dispatch]
  )

  return { state, actions }
}

// Exports para compatibilidade
export { MENU_ACTIONS, type MenuState }
