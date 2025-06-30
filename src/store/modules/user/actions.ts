import {
  USER_TYPES,
  UpdateProfileData,
  User,
  UpdateProfileRequestAction,
  UpdateProfileSuccessAction,
  UpdateProfileFailureAction,
} from './types'

export function updateProfileRequest(
  data: UpdateProfileData
): UpdateProfileRequestAction {
  return {
    type: USER_TYPES.UPDATE_PROFILE_REQUEST,
    payload: { data },
  }
}

export function updateProfileSuccess(
  profile: User
): UpdateProfileSuccessAction {
  return {
    type: USER_TYPES.UPDATE_PROFILE_SUCCESS,
    payload: { profile },
  }
}

export function updateProfileFailure(): UpdateProfileFailureAction {
  return {
    type: USER_TYPES.UPDATE_PROFILE_FAILURE,
  }
}
