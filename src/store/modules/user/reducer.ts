import produce from 'immer'
import { UserState, UserActions } from './types'

const INITIAL_STATE: UserState = {
  profile: null,
}

export default function user(
  state = INITIAL_STATE,
  action:
    | UserActions
    | {
        type: '@auth/SIGN_IN_SUCCESS' | '@auth/SIGN_OUT'
        payload?: { user: any }
      }
): UserState {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.profile = action.payload?.user || null
        break
      }

      case '@user/UPDATE_PROFILE_SUCCESS': {
        draft.profile = action.payload.profile
        break
      }

      case '@auth/SIGN_OUT': {
        draft.profile = null
        break
      }

      default:
    }
  })
}
