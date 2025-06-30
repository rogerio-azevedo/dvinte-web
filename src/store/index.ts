import { persistStore } from 'redux-persist'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'
import { Middleware, Store } from 'redux'

import createStore from './createStore'
import persistReducers from './persistReducers'
import { RootState } from './types'

import rootReducer from './modules/rootReducer'
import rootSaga from './modules/rootSaga'

declare global {
  interface Console {
    tron: {
      createSagaMonitor: () => any
    }
  }
}

const sagaMonitor =
  process.env.NODE_ENV === 'development' &&
  console.tron &&
  console.tron.createSagaMonitor
    ? console.tron.createSagaMonitor()
    : null

const sagaMiddleware: SagaMiddleware = createSagaMiddleware({ sagaMonitor })

const middlewares: Middleware[] = [sagaMiddleware]

const store: Store<RootState> = createStore(
  persistReducers(rootReducer),
  middlewares
)
const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export { store, persistor }
