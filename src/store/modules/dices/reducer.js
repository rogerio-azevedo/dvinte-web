import produce from 'immer'

const INITIAL_STATE = {
  diceType: null,
  diceSides: null,
  diceMult: null,
  diceResult: null,
  diceShow: false,
  diceRoll: false,
}

const dicesReducer = function dices(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@menu/DICE_DATA_SUCCESS':
        draft.diceType = action.payload.diceType
        draft.diceSides = action.payload.diceSides
        draft.diceMult = action.payload.diceMult
        draft.diceResult = action.payload.diceResult
        draft.diceShow = action.payload.diceShow
        draft.diceRoll = action.payload.diceRoll
        break
      default:
    }
  })
}

export default dicesReducer
