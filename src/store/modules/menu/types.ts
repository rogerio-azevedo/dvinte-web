// Action Types
export const MENU_TYPES = {
  // Show Menu
  SHOW_MENU_REQUEST: '@menu/SHOW_MENU_REQUEST',
  SHOW_MENU_SUCCESS: '@menu/SHOW_MENU_SUCCESS',
  SHOW_MENU_FAILURE: '@menu/SHOW_MENU_FAILURE',

  // Fog Level
  FOG_LEVEL_REQUEST: '@menu/FOG_LEVEL_REQUEST',
  FOG_LEVEL_SUCCESS: '@menu/FOG_LEVEL_SUCCESS',
  FOG_LEVEL_FAILURE: '@menu/FOG_LEVEL_FAILURE',

  // Eraser Size
  ERASER_SIZE_REQUEST: '@menu/ERASER_SIZE_REQUEST',
  ERASER_SIZE_SUCCESS: '@menu/ERASER_SIZE_SUCCESS',
  ERASER_SIZE_FAILURE: '@menu/ERASER_SIZE_FAILURE',

  // Fog Persist
  FOG_PERSIST_REQUEST: '@menu/FOG_PERSIST_REQUEST',
  FOG_PERSIST_SUCCESS: '@menu/FOG_PERSIST_SUCCESS',
  FOG_PERSIST_FAILURE: '@menu/FOG_PERSIST_FAILURE',

  // Fog Reset
  FOG_RESET: '@menu/FOG_RESET',
} as const

// Payload Types
export interface MenuState {
  chatMenu: any | null
  fogLevel: number
  eraserSize: number
  fogPersist: any[]
}

// Action Interfaces
export interface ShowMenuRequestAction {
  type: typeof MENU_TYPES.SHOW_MENU_REQUEST
  payload: any // TODO: Definir tipo específico
}

export interface ShowMenuSuccessAction {
  type: typeof MENU_TYPES.SHOW_MENU_SUCCESS
  payload: any
}

export interface ShowMenuFailureAction {
  type: typeof MENU_TYPES.SHOW_MENU_FAILURE
}

export interface FogLevelRequestAction {
  type: typeof MENU_TYPES.FOG_LEVEL_REQUEST
  payload: number
}

export interface FogLevelSuccessAction {
  type: typeof MENU_TYPES.FOG_LEVEL_SUCCESS
  payload: number
}

export interface FogLevelFailureAction {
  type: typeof MENU_TYPES.FOG_LEVEL_FAILURE
}

export interface EraserSizeRequestAction {
  type: typeof MENU_TYPES.ERASER_SIZE_REQUEST
  payload: number
}

export interface EraserSizeSuccessAction {
  type: typeof MENU_TYPES.ERASER_SIZE_SUCCESS
  payload: number
}

export interface EraserSizeFailureAction {
  type: typeof MENU_TYPES.ERASER_SIZE_FAILURE
}

export interface FogPersistRequestAction {
  type: typeof MENU_TYPES.FOG_PERSIST_REQUEST
  payload: any[] // TODO: Definir tipo específico
}

export interface FogPersistSuccessAction {
  type: typeof MENU_TYPES.FOG_PERSIST_SUCCESS
  payload: any[]
}

export interface FogPersistFailureAction {
  type: typeof MENU_TYPES.FOG_PERSIST_FAILURE
}

export interface FogResetAction {
  type: typeof MENU_TYPES.FOG_RESET
}

export type MenuActions =
  | ShowMenuRequestAction
  | ShowMenuSuccessAction
  | ShowMenuFailureAction
  | FogLevelRequestAction
  | FogLevelSuccessAction
  | FogLevelFailureAction
  | EraserSizeRequestAction
  | EraserSizeSuccessAction
  | EraserSizeFailureAction
  | FogPersistRequestAction
  | FogPersistSuccessAction
  | FogPersistFailureAction
  | FogResetAction
