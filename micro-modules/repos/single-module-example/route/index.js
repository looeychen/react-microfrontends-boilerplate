import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import isEqual from 'lodash/isEqual'
import NotMatch from '@components/notMatch'

const UserInfo = Loadable({ loader: () => import('../views/user-info/index'), loading: () => null })
const UserSetting = Loadable({ loader: () => import('../views/user-setting/index'), loading: () => null })

class UserRoute extends React.Component {
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
        <Route exact path={`${match.url}/info`} component={() => <UserInfo {...this.props} />} />
        <Route exact path={`${match.url}/setting`} component={() => <UserSetting {...this.props} />} />
        <Route component={() => <NotMatch />} />
      </Switch>
    )
  }
}

export default withRouter(UserRoute)
