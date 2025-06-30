import { takeLatest, put, all, Effect } from 'redux-saga/effects'
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

import {
  MENU_TYPES,
  ShowMenuRequestAction,
  FogLevelRequestAction,
  EraserSizeRequestAction,
  FogPersistRequestAction,
} from './types'

export function* showMenu({
  payload,
}: ShowMenuRequestAction): Generator<Effect, void, any> {
  try {
    yield put(showMenuSuccess(payload))
  } catch (err) {
    toast.error('Houve um erro ao alterar o menu')
    yield put(showMenuFailure())
  }
}

export function* fogLevel({
  payload,
}: FogLevelRequestAction): Generator<Effect, void, any> {
  try {
    yield put(fogLevelSuccess(payload))
  } catch (err) {
    toast.error('Houve um erro ao alterar o menu')
    yield put(fogLevelFailure())
  }
}

export function* eraserSize({
  payload,
}: EraserSizeRequestAction): Generator<Effect, void, any> {
  try {
    yield put(eraserSizeSuccess(payload))
  } catch (err) {
    toast.error('Houve um erro ao alterar o menu')
    yield put(eraserSizeFailure())
  }
}

export function* fogPersist({
  payload,
}: FogPersistRequestAction): Generator<Effect, void, any> {
  try {
    yield put(fogPersistSuccess(payload))
  } catch (err) {
    toast.error('Houve um erro ao alterar o menu')
    yield put(fogPersistFailure())
  }
}

export function* clearFog(): Generator<Effect, void, any> {
  try {
    yield put(fogReset())
  } catch (err) {
    toast.error('Houve um erro ao alterar o menu')
    yield put(fogReset())
  }
}

export default all([
  takeLatest(MENU_TYPES.SHOW_MENU_REQUEST, showMenu),
  takeLatest(MENU_TYPES.FOG_LEVEL_REQUEST, fogLevel),
  takeLatest(MENU_TYPES.ERASER_SIZE_REQUEST, eraserSize),
  takeLatest(MENU_TYPES.FOG_PERSIST_REQUEST, fogPersist),
])
