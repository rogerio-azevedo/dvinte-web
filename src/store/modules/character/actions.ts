import {
  CHARACTER_TYPES,
  CharacterPortrait,
  CharacterBase,
  CharacterClass,
  CharacterAttributes,
  CharacterPreview,
  CharPortraitRequestAction,
  CharPortraitSuccessAction,
  CharPortraitFailureAction,
  CharBaseRequestAction,
  CharBaseSuccessAction,
  CharBaseFailureAction,
  CharClassRequestAction,
  CharClassSuccessAction,
  CharClassFailureAction,
  CharAttrsRequestAction,
  CharAttrsSuccessAction,
  CharAttrsFailureAction,
  CharPreviewRequestAction,
  CharPreviewSuccessAction,
  CharPreviewFailureAction,
  CharResetAction,
} from './types'

// CHARACER PORTRAIT
export function charPortraitRequest(
  data: CharacterPortrait
): CharPortraitRequestAction {
  return {
    type: CHARACTER_TYPES.CHAR_PORTRAIT_REQUEST,
    payload: data,
  }
}

export function charPortraitSuccess(
  portrait: CharacterPortrait
): CharPortraitSuccessAction {
  return {
    type: CHARACTER_TYPES.CHAR_PORTRAIT_SUCCESS,
    payload: portrait,
  }
}

export function charPortraitFailure(): CharPortraitFailureAction {
  return {
    type: CHARACTER_TYPES.CHAR_PORTRAIT_FAILURE,
  }
}

// CHARACER BASE DATA
export function charBaseRequest(data: CharacterBase): CharBaseRequestAction {
  return {
    type: CHARACTER_TYPES.CHAR_BASE_REQUEST,
    payload: data,
  }
}

export function charBaseSuccess(base: CharacterBase): CharBaseSuccessAction {
  return {
    type: CHARACTER_TYPES.CHAR_BASE_SUCCESS,
    payload: { base },
  }
}

export function charBaseFailure(): CharBaseFailureAction {
  return {
    type: CHARACTER_TYPES.CHAR_BASE_FAILURE,
  }
}

// CHARACER CLASSES
export function charClassRequest(data: CharacterClass): CharClassRequestAction {
  return {
    type: CHARACTER_TYPES.CHAR_CLASS_REQUEST,
    payload: data,
  }
}

export function charClassSuccess(
  classe: CharacterClass
): CharClassSuccessAction {
  return {
    type: CHARACTER_TYPES.CHAR_CLASS_SUCCESS,
    payload: { classe },
  }
}

export function charClassFailure(): CharClassFailureAction {
  return {
    type: CHARACTER_TYPES.CHAR_CLASS_FAILURE,
  }
}

// CHARACER ATRRIBUTES
export function charAttrsRequest(
  data: CharacterAttributes
): CharAttrsRequestAction {
  return {
    type: CHARACTER_TYPES.CHAR_ATTRS_REQUEST,
    payload: data,
  }
}

export function charAttrsSuccess(
  attributes: CharacterAttributes
): CharAttrsSuccessAction {
  return {
    type: CHARACTER_TYPES.CHAR_ATTRS_SUCCESS,
    payload: { attributes },
  }
}

export function charAttrsFailure(): CharAttrsFailureAction {
  return {
    type: CHARACTER_TYPES.CHAR_ATTRS_FAILURE,
  }
}

// CHARACTER PREVIEW
export function charPreviewRequest(
  data: CharacterPreview
): CharPreviewRequestAction {
  return {
    type: CHARACTER_TYPES.CHAR_PREVIEW_REQUEST,
    payload: data,
  }
}

export function charPreviewSuccess(
  charPreview: CharacterPreview
): CharPreviewSuccessAction {
  return {
    type: CHARACTER_TYPES.CHAR_PREVIEW_SUCCESS,
    payload: { charPreview },
  }
}

export function charPreviewFailure(): CharPreviewFailureAction {
  return {
    type: CHARACTER_TYPES.CHAR_PREVIEW_FAILURE,
  }
}

export function charReset(): CharResetAction {
  return {
    type: CHARACTER_TYPES.CHAR_RESET,
  }
}
