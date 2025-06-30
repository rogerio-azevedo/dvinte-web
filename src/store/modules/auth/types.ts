// Action Types
export const AUTH_TYPES = {
  SIGN_IN_REQUEST: '@auth/SIGN_IN_REQUEST',
  SIGN_IN_SUCCESS: '@auth/SIGN_IN_SUCCESS',
  SIGN_UP_REQUEST: '@auth/SIGN_UP_REQUEST',
  SIGN_FAILURE: '@auth/SIGN_FAILURE',
  SIGN_OUT: '@auth/SIGN_OUT',
} as const

// Action Interfaces
export interface SignInRequestAction {
  type: typeof AUTH_TYPES.SIGN_IN_REQUEST
  payload: {
    email: string
    password: string
  }
}

export interface SignInSuccessAction {
  type: typeof AUTH_TYPES.SIGN_IN_SUCCESS
  payload: {
    token: string
  }
}

export interface SignUpRequestAction {
  type: typeof AUTH_TYPES.SIGN_UP_REQUEST
  payload: {
    name: string
    email: string
    password: string
  }
}

export interface SignFailureAction {
  type: typeof AUTH_TYPES.SIGN_FAILURE
}

export interface SignOutAction {
  type: typeof AUTH_TYPES.SIGN_OUT
}

export type AuthActions =
  | SignInRequestAction
  | SignInSuccessAction
  | SignUpRequestAction
  | SignFailureAction
  | SignOutAction
