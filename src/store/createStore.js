import { createStore, compose, applyMiddleware } from 'redux'

const createAppStore = (reducers, middlewares) => {
  const enhancer =
    process.env.NODE_ENV === 'development'
      ? compose(
          applyMiddleware(...middlewares),
          window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : f => f
        )
      : applyMiddleware(...middlewares)
  return createStore(reducers, enhancer)
}

export default createAppStore
