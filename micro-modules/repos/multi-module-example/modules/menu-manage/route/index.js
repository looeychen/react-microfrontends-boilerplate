import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import isEqual from 'lodash/isEqual'
import NotMatch from '@components/notMatch'

const MenuManage = Loadable({ loader: () => import('../views/index'), loading: () => null })

class MenuManageRoute extends React.Component {
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
        <Route exact path={`${match.url}/`} component={() => <MenuManage {...this.props} />} />
        <Route component={() => <NotMatch />} />
      </Switch>
    )
  }
}

export default withRouter(MenuManageRoute)
