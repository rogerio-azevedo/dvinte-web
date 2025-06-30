// Action Types
export const USER_TYPES = {
  UPDATE_PROFILE_REQUEST: '@user/UPDATE_PROFILE_REQUEST',
  UPDATE_PROFILE_SUCCESS: '@user/UPDATE_PROFILE_SUCCESS',
  UPDATE_PROFILE_FAILURE: '@user/UPDATE_PROFILE_FAILURE',
} as const

// Payload Types
export interface User {
  id: number
  name: string
  email: string
  oldPassword?: string
  password?: string
  confirmPassword?: string
}

export interface UserState {
  profile: User | null
}

export interface UpdateProfileData {
  name: string
  email: string
  oldPassword?: string
  password?: string
  confirmPassword?: string
}

// Action Interfaces
export interface UpdateProfileRequestAction {
  type: typeof USER_TYPES.UPDATE_PROFILE_REQUEST
  payload: { data: UpdateProfileData }
}

export interface UpdateProfileSuccessAction {
  type: typeof USER_TYPES.UPDATE_PROFILE_SUCCESS
  payload: { profile: User }
}

export interface UpdateProfileFailureAction {
  type: typeof USER_TYPES.UPDATE_PROFILE_FAILURE
}

export type UserActions =
  | UpdateProfileRequestAction
  | UpdateProfileSuccessAction
  | UpdateProfileFailureAction
