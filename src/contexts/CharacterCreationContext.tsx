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

// Estado inicial
interface Base {
  name: string
  age: string
  height: string
  weight: string
  hair: string
  eye: string
  skin: string
  level: string
  size: string
  gender: string
  divinity: string
  alignment: string
  race: string
  user_id: number
  is_ativo: boolean
}

interface Attributes {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

interface State {
  portrait: string | null
  base: Base
  classe: any[]
  attributes: Attributes
}

interface Action {
  type: string
  payload?: any
}

interface CharacterCreationProviderProps {
  children: ReactNode
}

const initialState: State = {
  portrait: null,
  base: {
    name: '',
    age: '',
    height: '',
    weight: '',
    hair: '',
    eye: '',
    skin: '',
    level: '',
    size: '',
    gender: '',
    divinity: '',
    alignment: '',
    race: '',
    user_id: 1,
    is_ativo: true,
  },
  classe: [],
  attributes: {
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8,
  },
}

// Actions
const ACTIONS = {
  SET_PORTRAIT: 'SET_PORTRAIT',
  SET_BASE_DATA: 'SET_BASE_DATA',
  SET_CLASSES: 'SET_CLASSES',
  SET_ATTRIBUTES: 'SET_ATTRIBUTES',
  RESET_CHARACTER: 'RESET_CHARACTER',
  RESET_ATTRIBUTES: 'RESET_ATTRIBUTES',
  UPDATE_BASE_FIELD: 'UPDATE_BASE_FIELD',
  INIT_STATE: 'INIT_STATE',
} as const

// Reducer
function characterCreationReducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.INIT_STATE:
      return { ...initialState }

    case ACTIONS.SET_PORTRAIT:
      return {
        ...state,
        portrait: action.payload,
      }

    case ACTIONS.SET_BASE_DATA:
      return {
        ...state,
        base: {
          ...state.base,
          ...action.payload,
        },
      }

    case ACTIONS.UPDATE_BASE_FIELD:
      return {
        ...state,
        base: {
          ...state.base,
          [action.payload.field]: action.payload.value,
        },
      }

    case ACTIONS.SET_CLASSES:
      return {
        ...state,
        classe: action.payload,
      }

    case ACTIONS.SET_ATTRIBUTES:
      return {
        ...state,
        attributes: {
          ...state.attributes,
          ...action.payload,
        },
      }

    case ACTIONS.RESET_ATTRIBUTES:
      return {
        ...state,
        attributes: {
          str: 8,
          dex: 8,
          con: 8,
          int: 8,
          wis: 8,
          cha: 8,
        },
      }

    case ACTIONS.RESET_CHARACTER:
      return { ...initialState }

    default:
      return state
  }
}

// Separar contexts para melhor performance (React 18 best practice)
const CharacterCreationStateContext = createContext<State | undefined>(
  undefined
)
const CharacterCreationDispatchContext = createContext<
  React.Dispatch<Action> | undefined
>(undefined)

// Provider otimizado para React 18
export function CharacterCreationProvider({
  children,
}: CharacterCreationProviderProps) {
  const [state, dispatch] = useReducer(characterCreationReducer, initialState)

  // Memoizar apenas o state - dispatch é estável por padrão
  const memoizedState = useMemo(() => state, [state])

  return (
    <CharacterCreationStateContext.Provider value={memoizedState}>
      <CharacterCreationDispatchContext.Provider value={dispatch}>
        {children}
      </CharacterCreationDispatchContext.Provider>
    </CharacterCreationStateContext.Provider>
  )
}

// Hook para acessar o state
export function useCharacterCreationState() {
  const context = useContext(CharacterCreationStateContext)
  if (context === undefined) {
    throw new Error(
      'useCharacterCreationState deve ser usado dentro de CharacterCreationProvider'
    )
  }
  return context
}

// Hook para acessar o dispatch
export function useCharacterCreationDispatch() {
  const context = useContext(CharacterCreationDispatchContext)
  if (context === undefined) {
    throw new Error(
      'useCharacterCreationDispatch deve ser usado dentro de CharacterCreationProvider'
    )
  }
  return context
}

// Hook customizado que combina state e actions (mantém compatibilidade)
export function useCharacterCreation() {
  const state = useCharacterCreationState()
  const dispatch = useCharacterCreationDispatch()

  // Usar useCallback para actions (React 18 best practice)
  const actions = useMemo(
    () => ({
      initState: () => {
        dispatch({ type: ACTIONS.INIT_STATE })
      },

      setPortrait: (portraitId: string) => {
        dispatch({ type: ACTIONS.SET_PORTRAIT, payload: portraitId })
      },

      setBaseData: (baseData: Partial<Base>) => {
        dispatch({ type: ACTIONS.SET_BASE_DATA, payload: baseData })
      },

      updateBaseField: (field: keyof Base, value: string) => {
        dispatch({
          type: ACTIONS.UPDATE_BASE_FIELD,
          payload: { field, value },
        })
      },

      setClasses: (classes: any[]) => {
        dispatch({ type: ACTIONS.SET_CLASSES, payload: classes })
      },

      setAttributes: (attributes: Partial<Attributes>) => {
        dispatch({ type: ACTIONS.SET_ATTRIBUTES, payload: attributes })
      },

      resetAttributes: () => {
        dispatch({ type: ACTIONS.RESET_ATTRIBUTES })
      },

      resetCharacter: () => {
        dispatch({ type: ACTIONS.RESET_CHARACTER })
      },

      getCharacterData: () => {
        return {
          ...state,
          base: {
            ...state.base,
            portrait_id: state.portrait,
          },
        }
      },
    }),
    [dispatch]
  )

  return { state, actions }
}

export { ACTIONS, type Base, type State, type Attributes }
