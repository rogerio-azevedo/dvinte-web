// CHARACER PORTRAIT
export function charPortraitRequest(data) {
  return {
    type: '@character/CHAR_PORTRAIT_REQUEST',
    payload: data,
  }
}

export function charPortraitSuccess(portrait) {
  return {
    type: '@character/CHAR_PORTRAIT_SUCCESS',
    payload: portrait,
  }
}

export function charPortraitFailure() {
  return {
    type: '@character/CHAR_PORTRAIT_FAILURE',
  }
}

// CHARACER BASE DATA
export function charBaseRequest(data) {
  return {
    type: '@character/CHAR_BASE_REQUEST',
    payload: data,
  }
}

export function charBaseSuccess(base) {
  return {
    type: '@character/CHAR_BASE_SUCCESS',
    payload: { base },
  }
}

export function charBaseFailure() {
  return {
    type: '@character/CHAR_BASE_FAILURE',
  }
}

// CHARACER CLASSES
export function charClassRequest(data) {
  return {
    type: '@character/CHAR_CLASS_REQUEST',
    payload: data,
  }
}

export function charClassSuccess(classe) {
  return {
    type: '@character/CHAR_CLASS_SUCCESS',
    payload: { classe },
  }
}

export function charClassFailure() {
  return {
    type: '@character/CHAR_CLASS_FAILURE',
  }
}

// CHARACER ATRRIBUTES
export function charAttrsRequest(data) {
  return {
    type: '@character/CHAR_ATTRS_REQUEST',
    payload: data,
  }
}

export function charAttrsSuccess(attributes) {
  return {
    type: '@character/CHAR_ATTRS_SUCCESS',
    payload: { attributes },
  }
}

export function charAttrsFailure() {
  return {
    type: '@character/CHAR_ATTRS_FAILURE',
  }
}

// CHARACTER PREVIEW
export function charPreviewRequest(data) {
  return {
    type: '@character/CHAR_PREVIEW_REQUEST',
    payload: data,
  }
}

export function charPreviewSuccess(charPreview) {
  return {
    type: '@character/CHAR_PREVIEW_SUCCESS',
    payload: { charPreview },
  }
}

export function charPreviewFailure() {
  return {
    type: '@character/CHAR_PREVIEW_FAILURE',
  }
}

export function charReset() {
  return {
    type: '@character/CHAR_RESET',
  }
}
