import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import isEqual from 'lodash/isEqual'

const Home = Loadable({
  loader: () => import('../views/home'),
  loading: () => null
})

class HomeRoute extends React.Component {
  static propTypes = {
    match: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    if (!isEqual(nextProps.location, this.props.location)) {
      return true
    }
    return false
  }

  render() {
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={() => <Home {...this.props} />} />
      </Switch>
    )
  }
}

export default withRouter(HomeRoute)
