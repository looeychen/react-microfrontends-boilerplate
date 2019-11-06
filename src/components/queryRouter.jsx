import React from 'react'
import PropTypes from 'prop-types'

import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import qhistory from 'qhistory'
import { stringify, parse } from 'qs'

class QueryRouter extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    children: PropTypes.node,
    stringify: PropTypes.func,
    parse: PropTypes.func,
  }

  history = qhistory(
    createBrowserHistory(this.props),
    this.props.stringify,
    this.props.parse
  )

  render() {
    return <Router history={this.history} children={this.props.children} />
  }
}

QueryRouter.defaultProps = {
  stringify,
  parse
}

export default QueryRouter
