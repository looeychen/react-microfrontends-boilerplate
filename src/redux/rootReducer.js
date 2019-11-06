import { routerReducer as routing } from 'react-router-redux'

const rootReducer = {
  //routing，这个Key值不能变，在redux-simple-router.syncHistory(history).listenForReplays(store)会用到
  routing
}

export default rootReducer
