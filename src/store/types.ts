import { Action } from 'redux'

// Auth Types
export interface AuthState {
  token: string | null
  signed: boolean
  loading: boolean
}

// User Types
export interface User {
  id: number
  name: string
  email: string
}

export interface UserState {
  profile: User | null
}

// Character Types
export interface CharacterBase {
  name: string
  // Adicione mais campos conforme necessário
}

export interface CharacterClass {
  name: string
  // Adicione mais campos conforme necessário
}

export interface CharacterAttributes {
  // Adicione os campos de atributos conforme necessário
  [key: string]: number
}

export interface CharacterState {
  portrait: string | null
  base: CharacterBase | null
  classe: CharacterClass | null
  attributes: CharacterAttributes | null
  charPreview?: any // Adicione o tipo específico se necessário
}

// Menu Types
export interface MenuState {
  chatMenu: any | null
  fogLevel: number
  eraserSize: number
  fogPersist: any[]
}

// Dices Types
export interface DicesState {
  diceType: string | null
  diceSides: number | null
  diceMult: number | null
  diceResult: number | null
  diceShow: boolean
  diceRoll: boolean
}

// Root State Type
export interface RootState {
  auth: AuthState
  user: UserState
  character: CharacterState
  menu: MenuState
  dices: DicesState
}

// Action Types
export interface ReduxAction extends Action {
  payload?: any
}
