import {
  createStore,
  compose,
  applyMiddleware,
  Reducer,
  Middleware,
  StoreEnhancer,
} from 'redux'
import { RootState } from './types'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer
  }
}

const createAppStore = (
  reducers: Reducer<RootState>,
  middlewares: Middleware[]
) => {
  const enhancer =
    process.env.NODE_ENV === 'development'
      ? compose(
          applyMiddleware(...middlewares),
          window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : ((f => f) as StoreEnhancer)
        )
      : applyMiddleware(...middlewares)

  return createStore(reducers, enhancer)
}

export default createAppStore
