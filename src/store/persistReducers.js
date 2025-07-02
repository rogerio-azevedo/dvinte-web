import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const persistConfig = reducers => {
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

export default persistConfig
