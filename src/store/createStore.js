import { createStore, compose, applyMiddleware } from 'redux'

const configureStore = (reducers, middlewares) => {
  const enhancer =
    process.env.NODE_ENV === 'development'
      ? compose(console.tron.createEnhancer(), applyMiddleware(...middlewares))
      : applyMiddleware(...middlewares)
  return createStore(reducers, enhancer)
}

export default configureStore
