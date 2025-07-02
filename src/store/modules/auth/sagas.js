/* eslint-disable no-console */

import { takeLatest, call, put, all } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import api from '../../../services/api'
import { signInSuccess, signFailure } from './actions'
import { navigate } from '../../../services/navigate'

export function* signIn({ payload }) {
  try {
    const { email, password } = payload

    console.log('Tentando login com:', { email })

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    })

    console.log('Resposta da API:', response.data)

    const { token, user } = response.data

    if (!user) {
      console.error('Usuário não encontrado na resposta')
      toast.error('Usuário não encontrado')
      return
    }

    console.log('Dados do usuário:', user)

    api.defaults.headers.Authorization = `Bearer ${token}`

    yield put(signInSuccess(token, user))

    window.location.href = '/dashboard'
  } catch (err) {
    console.error('Erro no login:', err)
    toast.error('Falha na autenticação, verifique seus dados')
    yield put(signFailure())
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password, phone, city, state } = payload

    yield call(api.post, 'users', {
      name,
      email,
      password,
      phone,
      city,
      state,
      is_ativo: true,
    })
    navigate('/')
  } catch (err) {
    toast.error('Falha no cadastro, verifique seus dados!')
    yield put(signFailure())
  }
}

export function setToken({ payload }) {
  if (!payload) return

  const { token } = payload.auth

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`
  }
}

export function signOut() {
  navigate('/')
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
])
