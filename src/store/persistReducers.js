import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const persistReducers = reducers => {
  const persitedReducer = persistReducer(
    {
      key: 'dvinte',
      storage,
      whitelist: ['auth', 'user', 'character', 'menu', 'dices'],
    },
    reducers
  )
  return persitedReducer
}

export default persistReducers
