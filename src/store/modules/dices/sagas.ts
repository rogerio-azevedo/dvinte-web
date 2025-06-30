import { takeLatest, put, all, Effect } from 'redux-saga/effects'
import { toast } from 'react-toastify'

import { diceDataSuccess, diceDataFailure } from './actions'
import { DICE_TYPES, DiceDataRequestAction } from './types'

export function* dataDice({
  payload,
}: DiceDataRequestAction): Generator<Effect, void, any> {
  try {
    yield put(diceDataSuccess(payload))
  } catch (err) {
    toast.error('Houve um erro ao alterar as informações do dado')
    yield put(diceDataFailure())
  }
}

export default all([takeLatest(DICE_TYPES.DICE_DATA_REQUEST, dataDice)])
