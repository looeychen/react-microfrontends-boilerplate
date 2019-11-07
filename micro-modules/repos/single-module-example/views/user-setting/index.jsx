import React from 'react'
import CSSModules from 'react-css-modules'
import connect from 'redux-connect-decorator'
import { actions } from '../../redux/modules/userSetting'
import styles from './index.module.less';

@connect((state) => ({
  // xxx: state.xxx
}), { ...actions })
@CSSModules(styles)
class UserSetting extends React.Component {
  render() {
    return (
      <div styleName="module-wrap">
        单模块示例：用户模块 > 用户设置
      </div>
    )
  }
}

export default UserSetting;
