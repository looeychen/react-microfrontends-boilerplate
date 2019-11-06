import React from 'react'
import { hot } from 'react-hot-loader';
import { Route } from 'react-router-dom'
import QueryRouter from '@components/queryRouter'
import Main from './views/layouts/main'

const App = ({ store }) => (
  <QueryRouter>
    <Route path='/' component={() => <Main store={store} />} />
  </QueryRouter>
)

export default hot(module)(App);
