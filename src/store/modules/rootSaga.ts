import { all, Effect } from 'redux-saga/effects'

import auth from './auth/sagas'
import user from './user/sagas'
import character from './character/sagas'
import menu from './menu/sagas'
import dices from './dices/sagas'

export default function* rootSaga(): Generator<Effect, void, any> {
  return yield all([auth, user, character, menu, dices])
}
