import React from 'react'
import CSSModules from 'react-css-modules'
import { connect } from 'react-redux'
import { actions } from '../../redux/modules/userInfo'
import styles from './index.module.less';

@CSSModules(styles)
class UserInfo extends React.Component {
  render() {
    return (
      <div styleName="module-wrap">
        单模块示例：用户模块 > 用户信息
      </div>
    )
  }
}

export default connect(null, actions)(UserInfo)
