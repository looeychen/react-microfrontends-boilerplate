import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './index.module.less';

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
