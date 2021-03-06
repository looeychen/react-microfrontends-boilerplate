import React from 'react'
import CSSModules from 'react-css-modules'
import { connect } from 'react-redux'
import { actions } from '../redux/modules/menuManage'
import styles from './index.module.less';

@CSSModules(styles)
class MenuManage extends React.Component {
  render() {
    return (
      <div styleName="module-wrap">
        多模块示例：菜单管理模块
      </div>
    )
  }
}

export default connect(null, actions)(MenuManage)
