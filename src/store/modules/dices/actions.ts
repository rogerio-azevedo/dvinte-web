import {
  DICE_TYPES,
  DiceData,
  DiceDataRequestAction,
  DiceDataSuccessAction,
  DiceDataFailureAction,
} from './types'

export const diceDataRequest = (payload: DiceData): DiceDataRequestAction => ({
  type: DICE_TYPES.DICE_DATA_REQUEST,
  payload,
})

export const diceDataSuccess = (payload: DiceData): DiceDataSuccessAction => ({
  type: DICE_TYPES.DICE_DATA_SUCCESS,
  payload,
})

export const diceDataFailure = (): DiceDataFailureAction => ({
  type: DICE_TYPES.DICE_DATA_FAILURE,
})
