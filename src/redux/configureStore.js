import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware'
import rootReducer from './rootReducer'

export default function configureStore(initialState) {
  const middlewares = [apiMiddleware, thunkMiddleware]
  const createStoreWithMiddleware = compose(applyMiddleware(...middlewares))
  const store = createStoreWithMiddleware(createStore)(combineReducers(rootReducer), initialState)
  store.reducers = { ...rootReducer }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default
      store.replaceReducer(combineReducers(nextRootReducer))
    })
  }

  return store
}
