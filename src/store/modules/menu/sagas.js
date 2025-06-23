import { takeLatest, put, all } from 'redux-saga/effects'
import { toast } from 'react-toastify'

import {
  showMenuSuccess,
  showMenuFailure,
  fogLevelSuccess,
  fogLevelFailure,
  eraserSizeSuccess,
  eraserSizeFailure,
  fogPersistSuccess,
  fogPersistFailure,
  fogReset,
} from './actions'

export function* showMenu({ payload }) {
  try {
    yield put(showMenuSuccess(payload))
  } catch (err) {
    toast.console.error('Houve um erro ao alterar o menu')
    yield put(showMenuFailure())
  }
}

export function* fogLevel({ payload }) {
  try {
    yield put(fogLevelSuccess(payload))
  } catch (err) {
    toast.console.error('Houve um erro ao alterar o menu')
    yield put(fogLevelFailure())
  }
}

export function* eraserSize({ payload }) {
  try {
    yield put(eraserSizeSuccess(payload))
  } catch (err) {
    toast.console.error('Houve um erro ao alterar o menu')
    yield put(eraserSizeFailure())
  }
}

export function* fogPersist({ payload }) {
  try {
    yield put(fogPersistSuccess(payload))
  } catch (err) {
    toast.console.error('Houve um erro ao alterar o menu')
    yield put(fogPersistFailure())
  }
}

export function* clearFog() {
  try {
    yield put(fogReset())
  } catch (err) {
    toast.console.error('Houve um erro ao alterar o menu')
    yield put(fogReset())
  }
}

export default all([
  takeLatest('@menu/SHOW_MENU_REQUEST', showMenu),
  takeLatest('@menu/FOG_LEVEL_REQUEST', fogLevel),
  takeLatest('@menu/ERASER_SIZE_REQUEST', eraserSize),
  takeLatest('@menu/FOG_PERSIST_REQUEST', fogPersist),
])
