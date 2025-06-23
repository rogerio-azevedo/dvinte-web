import { takeLatest, put, all } from 'redux-saga/effects'
import { toast } from 'react-toastify'

import { diceDataSuccess, diceDataFailure } from './actions'

export function* dataDice({ payload }) {
  try {
    yield put(diceDataSuccess(payload))
  } catch (err) {
    toast.console.error('Houve um erro ao alterar as informações do dado')
    yield put(diceDataFailure())
  }
}

export default all([takeLatest('@menu/DICE_DATA_REQUEST', dataDice)])
