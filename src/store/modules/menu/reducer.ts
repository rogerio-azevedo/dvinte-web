import { MenuState, ReduxAction } from '../../types'

const INITIAL_STATE: MenuState = {
  chatMenu: null,
  fogLevel: 60,
  eraserSize: 60,
  fogPersist: [],
}

const menuReducer = (state = INITIAL_STATE, action: ReduxAction): MenuState => {
  switch (action.type) {
    case '@menu/SHOW_MENU_SUCCESS':
      return {
        ...state,
        chatMenu: action.payload,
      }

    case '@menu/FOG_LEVEL_SUCCESS':
      return {
        ...state,
        fogLevel: action.payload,
      }

    case '@menu/ERASER_SIZE_SUCCESS':
      return {
        ...state,
        eraserSize: action.payload,
      }

    case '@menu/FOG_PERSIST_SUCCESS':
      return {
        ...state,
        fogPersist: action.payload,
      }

    case '@menu/FOG_RESET':
      return {
        ...state,
        fogPersist: [],
      }

    default:
      return state
  }
}

export default menuReducer
