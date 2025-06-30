import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { Reducer } from 'redux'
import { RootState } from './types'

const persistReducers = (reducers: Reducer<RootState>) => {
  const persistedReducer = persistReducer(
    {
      key: 'dvinte',
      storage,
      whitelist: ['auth', 'user', 'character', 'menu', 'dices'],
    },
    reducers
  )
  return persistedReducer
}

export default persistReducers
