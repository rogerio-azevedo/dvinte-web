/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { takeLatest, put, call, all, Effect } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import history from '../../../services/history'

import api from '../../../services/api'

import {
  charPortraitSuccess,
  charPortraitFailure,
  charBaseSuccess,
  charBaseFailure,
  charClassSuccess,
  charClassFailure,
  charAttrsSuccess,
  charAttrsFailure,
  charPreviewFailure,
  charReset,
} from './actions'

import {
  CHARACTER_TYPES,
  CharPortraitRequestAction,
  CharBaseRequestAction,
  CharClassRequestAction,
  CharAttrsRequestAction,
  CharPreviewRequestAction,
} from './types'

export function* portraitCharacter({
  payload,
}: CharPortraitRequestAction): Generator<Effect, void, any> {
  try {
    // toast.success('Retrato selecionado!')

    yield put(charPortraitSuccess(payload))
  } catch (err) {
    toast.error('Houve um erro ao criar o Portrait do Personagem')
    yield put(charPortraitFailure())
  }
}

export function* baseCharacter({
  payload,
}: CharBaseRequestAction): Generator<Effect, void, any> {
  try {
    console.log('🔍 Saga baseCharacter - Payload recebido:', payload)
    toast.success('Dados básicos criados com sucesso!')

    yield put(charBaseSuccess(payload))
    console.log('🔍 Saga baseCharacter - Success action disparada')
  } catch (err) {
    console.error('🔍 Saga baseCharacter - Erro:', err)
    toast.error('Houve um erro ao criar o Personagem')
    yield put(charBaseFailure())
  }
}

export function* classCharacter({
  payload,
}: CharClassRequestAction): Generator<Effect, void, any> {
  try {
    toast.success('Classes criadas com sucesso!')

    yield put(charClassSuccess(payload))
  } catch (err) {
    toast.error('Houve um erro ao criar o Personagem')
    yield put(charClassFailure())
  }
}

export function* attrsCharacter({
  payload,
}: CharAttrsRequestAction): Generator<Effect, void, any> {
  try {
    toast.success('Atributos criados com sucesso!')

    yield put(charAttrsSuccess(payload))
  } catch (err) {
    toast.error('Houve um erro ao criar o Personagem')
    yield put(charAttrsFailure())
  }
}

export function* createCharacter({
  payload,
}: CharPreviewRequestAction): Generator<Effect, void, any> {
  try {
    yield call(api.post, 'characters', payload)
    toast.success('Personagem criado com sucesso!')
    yield put(charReset())
    // Limpar flag de criação em progresso
    localStorage.removeItem('character_creation_in_progress')
    history.push('/characters')
  } catch (err) {
    toast.error('Houve um erro ao criar o Personagem')
    yield put(charPreviewFailure())
  }
}

export default all([
  takeLatest(CHARACTER_TYPES.CHAR_PORTRAIT_REQUEST, portraitCharacter),
  takeLatest(CHARACTER_TYPES.CHAR_BASE_REQUEST, baseCharacter),
  takeLatest(CHARACTER_TYPES.CHAR_CLASS_REQUEST, classCharacter),
  takeLatest(CHARACTER_TYPES.CHAR_ATTRS_REQUEST, attrsCharacter),
  takeLatest(CHARACTER_TYPES.CHAR_PREVIEW_REQUEST, createCharacter),
])
