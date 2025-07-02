export const diceDataRequest = payload => ({
  type: '@menu/DICE_DATA_REQUEST',
  payload,
})

export const diceDataSuccess = payload => ({
  type: '@menu/DICE_DATA_SUCCESS',
  payload,
})

export const diceDataFailure = () => ({
  type: '@menu/DICE_DATA_FAILURE',
})
