import {
  MENU_TYPES,
  ShowMenuRequestAction,
  ShowMenuSuccessAction,
  ShowMenuFailureAction,
  FogLevelRequestAction,
  FogLevelSuccessAction,
  FogLevelFailureAction,
  EraserSizeRequestAction,
  EraserSizeSuccessAction,
  EraserSizeFailureAction,
  FogPersistRequestAction,
  FogPersistSuccessAction,
  FogPersistFailureAction,
  FogResetAction,
} from './types'

export const showMenuRequest = (payload: any): ShowMenuRequestAction => ({
  type: MENU_TYPES.SHOW_MENU_REQUEST,
  payload,
})

export const showMenuSuccess = (payload: any): ShowMenuSuccessAction => ({
  type: MENU_TYPES.SHOW_MENU_SUCCESS,
  payload,
})

export const showMenuFailure = (): ShowMenuFailureAction => ({
  type: MENU_TYPES.SHOW_MENU_FAILURE,
})

export const fogLevelRequest = (payload: number): FogLevelRequestAction => ({
  type: MENU_TYPES.FOG_LEVEL_REQUEST,
  payload,
})

export const fogLevelSuccess = (payload: number): FogLevelSuccessAction => ({
  type: MENU_TYPES.FOG_LEVEL_SUCCESS,
  payload,
})

export const fogLevelFailure = (): FogLevelFailureAction => ({
  type: MENU_TYPES.FOG_LEVEL_FAILURE,
})

export const eraserSizeRequest = (
  payload: number
): EraserSizeRequestAction => ({
  type: MENU_TYPES.ERASER_SIZE_REQUEST,
  payload,
})

export const eraserSizeSuccess = (
  payload: number
): EraserSizeSuccessAction => ({
  type: MENU_TYPES.ERASER_SIZE_SUCCESS,
  payload,
})

export const eraserSizeFailure = (): EraserSizeFailureAction => ({
  type: MENU_TYPES.ERASER_SIZE_FAILURE,
})

export const fogPersistRequest = (payload: any[]): FogPersistRequestAction => ({
  type: MENU_TYPES.FOG_PERSIST_REQUEST,
  payload,
})

export const fogPersistSuccess = (payload: any[]): FogPersistSuccessAction => ({
  type: MENU_TYPES.FOG_PERSIST_SUCCESS,
  payload,
})

export const fogPersistFailure = (): FogPersistFailureAction => ({
  type: MENU_TYPES.FOG_PERSIST_FAILURE,
})

export const fogReset = (): FogResetAction => ({
  type: MENU_TYPES.FOG_RESET,
})
