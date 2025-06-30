import { combineReducers } from 'redux'
import { RootState } from '../types'

import auth from './auth/reducer'
import user from './user/reducer'
import character from './character/reducer'
import menu from './menu/reducer'
import dices from './dices/reducer'

export default combineReducers<RootState>({
  auth,
  user,
  character,
  menu,
  dices,
})
