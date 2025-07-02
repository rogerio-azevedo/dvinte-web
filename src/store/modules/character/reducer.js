import produce from 'immer'

const INITIAL_STATE = {
  portrait: null,
  base: null,
  classe: null,
  attributes: null,
}

export default function character(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@character/CHAR_PORTRAIT_SUCCESS': {
        draft.portrait = action.payload.portrait
        break
      }

      case '@character/CHAR_BASE_SUCCESS': {
        draft.base = action.payload.base
        break
      }

      case '@character/CHAR_CLASS_SUCCESS': {
        draft.classe = action.payload.classe
        break
      }

      case '@character/CHAR_ATTRS_SUCCESS': {
        draft.attributes = action.payload.attributes
        break
      }

      case '@character/CHAR_PREVIEW_SUCCESS': {
        draft.charPreview = action.payload.charPreview
        break
      }

      case '@character/CHAR_RESET': {
        draft.portrait = null
        draft.base = null
        draft.classe = null
        draft.attributes = null
        break
      }

      default:
    }
  })
}
