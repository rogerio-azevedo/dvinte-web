// Action Types
export const DICE_TYPES = {
  DICE_DATA_REQUEST: '@menu/DICE_DATA_REQUEST',
  DICE_DATA_SUCCESS: '@menu/DICE_DATA_SUCCESS',
  DICE_DATA_FAILURE: '@menu/DICE_DATA_FAILURE',
} as const

// Payload Types
export interface DiceData {
  diceType?: string | null
  diceSides?: number | null
  diceMult?: number | null
  diceResult?: number | number[] | null
  diceShow: boolean
  diceRoll?: boolean
}

// Action Interfaces
export interface DiceDataRequestAction {
  type: typeof DICE_TYPES.DICE_DATA_REQUEST
  payload: DiceData
}

export interface DiceDataSuccessAction {
  type: typeof DICE_TYPES.DICE_DATA_SUCCESS
  payload: DiceData
}

export interface DiceDataFailureAction {
  type: typeof DICE_TYPES.DICE_DATA_FAILURE
}

export type DiceActions =
  | DiceDataRequestAction
  | DiceDataSuccessAction
  | DiceDataFailureAction
