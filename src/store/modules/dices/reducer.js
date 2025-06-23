const INITIAL_STATE = {
  diceType: null,
  diceSides: null,
  diceMult: null,
  diceResult: null,
  diceShow: false,
  diceRoll: false,
}

const dicesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case '@menu/DICE_DATA_SUCCESS':
      return {
        ...state,
        diceType: action.payload.diceType,
        diceSides: action.payload.diceSides,
        diceMult: action.payload.diceMult,
        diceResult: action.payload.diceResult,
        diceShow: action.payload.diceShow,
        diceRoll: action.payload.diceRoll,
      }

    default:
      return state
  }
}

export default dicesReducer
