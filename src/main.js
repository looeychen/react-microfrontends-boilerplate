import 'babel-polyfill'
import 'url-polyfill'

require('es6-promise').polyfill()

import 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'

import configureStore from './redux/configureStore'

const store = configureStore()

const render = (Component) => {
  ReactDOM.render(
    < Provider store={store} >
      <Component store={store} />
    </Provider >,
    document.getElementById('root')
  )
}

render(App)

