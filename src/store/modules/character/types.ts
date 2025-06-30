// Action Types
export const CHARACTER_TYPES = {
  // Portrait
  CHAR_PORTRAIT_REQUEST: '@character/CHAR_PORTRAIT_REQUEST',
  CHAR_PORTRAIT_SUCCESS: '@character/CHAR_PORTRAIT_SUCCESS',
  CHAR_PORTRAIT_FAILURE: '@character/CHAR_PORTRAIT_FAILURE',

  // Base
  CHAR_BASE_REQUEST: '@character/CHAR_BASE_REQUEST',
  CHAR_BASE_SUCCESS: '@character/CHAR_BASE_SUCCESS',
  CHAR_BASE_FAILURE: '@character/CHAR_BASE_FAILURE',

  // Class
  CHAR_CLASS_REQUEST: '@character/CHAR_CLASS_REQUEST',
  CHAR_CLASS_SUCCESS: '@character/CHAR_CLASS_SUCCESS',
  CHAR_CLASS_FAILURE: '@character/CHAR_CLASS_FAILURE',

  // Attributes
  CHAR_ATTRS_REQUEST: '@character/CHAR_ATTRS_REQUEST',
  CHAR_ATTRS_SUCCESS: '@character/CHAR_ATTRS_SUCCESS',
  CHAR_ATTRS_FAILURE: '@character/CHAR_ATTRS_FAILURE',

  // Preview
  CHAR_PREVIEW_REQUEST: '@character/CHAR_PREVIEW_REQUEST',
  CHAR_PREVIEW_SUCCESS: '@character/CHAR_PREVIEW_SUCCESS',
  CHAR_PREVIEW_FAILURE: '@character/CHAR_PREVIEW_FAILURE',

  // Reset
  CHAR_RESET: '@character/CHAR_RESET',
} as const

// Payload Types
export interface CharacterPortrait {
  // Adicione os campos necessários para o retrato
  url: string
}

export interface CharacterBase {
  name: string
  race: string
  // Adicione outros campos necessários
}

export interface CharacterClass {
  name: string
  level: number
  // Adicione outros campos necessários
}

export interface CharacterAttributes {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export interface CharacterPreview {
  portrait: CharacterPortrait
  base: CharacterBase
  classe: CharacterClass
  attributes: CharacterAttributes
}

// Action Interfaces
export interface CharPortraitRequestAction {
  type: typeof CHARACTER_TYPES.CHAR_PORTRAIT_REQUEST
  payload: CharacterPortrait
}

export interface CharPortraitSuccessAction {
  type: typeof CHARACTER_TYPES.CHAR_PORTRAIT_SUCCESS
  payload: CharacterPortrait
}

export interface CharPortraitFailureAction {
  type: typeof CHARACTER_TYPES.CHAR_PORTRAIT_FAILURE
}

export interface CharBaseRequestAction {
  type: typeof CHARACTER_TYPES.CHAR_BASE_REQUEST
  payload: CharacterBase
}

export interface CharBaseSuccessAction {
  type: typeof CHARACTER_TYPES.CHAR_BASE_SUCCESS
  payload: { base: CharacterBase }
}

export interface CharBaseFailureAction {
  type: typeof CHARACTER_TYPES.CHAR_BASE_FAILURE
}

export interface CharClassRequestAction {
  type: typeof CHARACTER_TYPES.CHAR_CLASS_REQUEST
  payload: CharacterClass
}

export interface CharClassSuccessAction {
  type: typeof CHARACTER_TYPES.CHAR_CLASS_SUCCESS
  payload: { classe: CharacterClass }
}

export interface CharClassFailureAction {
  type: typeof CHARACTER_TYPES.CHAR_CLASS_FAILURE
}

export interface CharAttrsRequestAction {
  type: typeof CHARACTER_TYPES.CHAR_ATTRS_REQUEST
  payload: CharacterAttributes
}

export interface CharAttrsSuccessAction {
  type: typeof CHARACTER_TYPES.CHAR_ATTRS_SUCCESS
  payload: { attributes: CharacterAttributes }
}

export interface CharAttrsFailureAction {
  type: typeof CHARACTER_TYPES.CHAR_ATTRS_FAILURE
}

export interface CharPreviewRequestAction {
  type: typeof CHARACTER_TYPES.CHAR_PREVIEW_REQUEST
  payload: CharacterPreview
}

export interface CharPreviewSuccessAction {
  type: typeof CHARACTER_TYPES.CHAR_PREVIEW_SUCCESS
  payload: { charPreview: CharacterPreview }
}

export interface CharPreviewFailureAction {
  type: typeof CHARACTER_TYPES.CHAR_PREVIEW_FAILURE
}

export interface CharResetAction {
  type: typeof CHARACTER_TYPES.CHAR_RESET
}

export type CharacterActions =
  | CharPortraitRequestAction
  | CharPortraitSuccessAction
  | CharPortraitFailureAction
  | CharBaseRequestAction
  | CharBaseSuccessAction
  | CharBaseFailureAction
  | CharClassRequestAction
  | CharClassSuccessAction
  | CharClassFailureAction
  | CharAttrsRequestAction
  | CharAttrsSuccessAction
  | CharAttrsFailureAction
  | CharPreviewRequestAction
  | CharPreviewSuccessAction
  | CharPreviewFailureAction
  | CharResetAction
