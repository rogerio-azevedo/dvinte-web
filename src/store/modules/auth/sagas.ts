import { takeLatest, call, put, all, Effect } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import api from '../../../services/api'
import { signInSuccess, signFailure } from './actions'
import history from '../../../services/history'
import { SignInRequestAction, SignUpRequestAction, AUTH_TYPES } from './types'

interface SignInResponse {
  token: string
  user: any // TODO: Definir tipo do usuário
}

interface RehydrateAction {
  type: 'persist/REHYDRATE'
  payload?: {
    auth: {
      token: string
    }
  }
}

export function* signIn({
  payload,
}: SignInRequestAction): Generator<Effect, void, SignInResponse> {
  try {
    const { email, password } = payload

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    })

    const { token, user } = response

    api.defaults.headers.Authorization = `Bearer ${token}`

    yield put(signInSuccess(token, user))

    history.push('/dashboard')
  } catch (err) {
    toast.error('Falha na autenticação, verifique seus dados')
    yield put(signFailure())
  }
}

export function* signUp({
  payload,
}: SignUpRequestAction): Generator<Effect, void, any> {
  try {
    const { name, email, password } = payload

    yield call(api.post, 'users', {
      name,
      email,
      password,
      is_ativo: true,
    })

    history.push('/')
  } catch (err) {
    toast.error('Falha no cadastro, verifique seus dados!')
    yield put(signFailure())
  }
}

export function setToken({ payload }: RehydrateAction): void {
  if (!payload) return

  const { token } = payload.auth

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`
  }
}

export function signOut(): void {
  history.push('/')
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest(AUTH_TYPES.SIGN_IN_REQUEST, signIn),
  takeLatest(AUTH_TYPES.SIGN_UP_REQUEST, signUp),
  takeLatest(AUTH_TYPES.SIGN_OUT, signOut),
])
