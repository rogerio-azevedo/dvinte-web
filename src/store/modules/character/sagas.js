/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { takeLatest, put, call, all } from 'redux-saga/effects'
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

export function* portraitCharacter({ payload }) {
  try {
    // toast.success('Retrato selecionado!')

    yield put(charPortraitSuccess(payload))
  } catch (err) {
    toast.console.error('Houve um erro ao criar o Portrait do Personagem')
    yield put(charPortraitFailure())
  }
}

export function* baseCharacter({ payload }) {
  try {
    console.log('🔍 Saga baseCharacter - Payload recebido:', payload)
    toast.success('Dados básicos criados com sucesso!')

    yield put(charBaseSuccess(payload))
    console.log('🔍 Saga baseCharacter - Success action disparada')
  } catch (err) {
    console.error('🔍 Saga baseCharacter - Erro:', err)
    toast.console.error('Houve um erro ao criar o Personagem')
    yield put(charBaseFailure())
  }
}

export function* classCharacter({ payload }) {
  try {
    toast.success('Classes criadas com sucesso!')

    yield put(charClassSuccess(payload))
  } catch (err) {
    toast.console.error('Houve um erro ao criar o Personagem')
    yield put(charClassFailure())
  }
}

export function* attrsCharacter({ payload }) {
  try {
    toast.success('Atributos criados com sucesso!')

    yield put(charAttrsSuccess(payload))
  } catch (err) {
    toast.console.error('Houve um erro ao criar o Personagem')
    yield put(charAttrsFailure())
  }
}

export function* createCharacter({ payload }) {
  try {
    yield call(api.post, 'characters', payload)
    toast.success('Personagem criado com sucesso!')
    yield put(charReset())
    // Limpar flag de criação em progresso
    localStorage.removeItem('character_creation_in_progress')
    history.push('/characters')
  } catch (err) {
    toast.console.error('Houve um erro ao criar o Personagem')
    yield put(charPreviewFailure())
  }
}

export default all([
  takeLatest('@character/CHAR_PORTRAIT_REQUEST', portraitCharacter),
  takeLatest('@character/CHAR_BASE_REQUEST', baseCharacter),
  takeLatest('@character/CHAR_CLASS_REQUEST', classCharacter),
  takeLatest('@character/CHAR_ATTRS_REQUEST', attrsCharacter),
  takeLatest('@character/CHAR_PREVIEW_REQUEST', createCharacter),
])
