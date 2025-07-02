export const showMenuRequest = payload => ({
  type: '@menu/SHOW_MENU_REQUEST',
  payload,
})

export const showMenuSuccess = payload => ({
  type: '@menu/SHOW_MENU_SUCCESS',
  payload,
})

export const showMenuFailure = () => ({
  type: '@menu/SHOW_MENU_FAILURE',
})

export const fogLevelRequest = payload => ({
  type: '@menu/FOG_LEVEL_REQUEST',
  payload,
})

export const fogLevelSuccess = payload => ({
  type: '@menu/FOG_LEVEL_SUCCESS',
  payload,
})

export const fogLevelFailure = () => ({
  type: '@menu/FOG_LEVEL_FAILURE',
})

export const eraserSizeRequest = payload => ({
  type: '@menu/ERASER_SIZE_REQUEST',
  payload,
})

export const eraserSizeSuccess = payload => ({
  type: '@menu/ERASER_SIZE_SUCCESS',
  payload,
})

export const eraserSizeFailure = () => ({
  type: '@menu/ERASER_SIZE_FAILURE',
})

export const fogPersistRequest = payload => ({
  type: '@menu/FOG_PERSIST_REQUEST',
  payload,
})

export const fogPersistSuccess = payload => ({
  type: '@menu/FOG_PERSIST_SUCCESS',
  payload,
})

export const fogPersistFailure = () => ({
  type: '@menu/FOG_PERSIST_FAILURE',
})

export function fogReset() {
  return {
    type: '@menu/FOG_RESET',
  }
}
