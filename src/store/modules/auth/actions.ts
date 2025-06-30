import {
  AUTH_TYPES,
  SignInRequestAction,
  SignInSuccessAction,
  SignUpRequestAction,
  SignFailureAction,
  SignOutAction,
} from './types'

export function signInRequest(
  email: string,
  password: string
): SignInRequestAction {
  return {
    type: AUTH_TYPES.SIGN_IN_REQUEST,
    payload: { email, password },
  }
}

export function signInSuccess(token: string, user: any): SignInSuccessAction {
  return {
    type: AUTH_TYPES.SIGN_IN_SUCCESS,
    payload: { token },
  }
}

export function signUpRequest(
  name: string,
  email: string,
  password: string,
  phone?: string,
  city?: string,
  state?: string
): SignUpRequestAction {
  return {
    type: AUTH_TYPES.SIGN_UP_REQUEST,
    payload: { name, email, password },
  }
}

export function signFailure(): SignFailureAction {
  return {
    type: AUTH_TYPES.SIGN_FAILURE,
  }
}

export function signOut(): SignOutAction {
  return {
    type: AUTH_TYPES.SIGN_OUT,
  }
}
