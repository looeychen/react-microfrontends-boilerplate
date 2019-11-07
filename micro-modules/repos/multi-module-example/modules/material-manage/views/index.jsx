import React from 'react'
import CSSModules from 'react-css-modules'
import connect from 'redux-connect-decorator'
import { actions } from '../redux/modules/materialManage'
import styles from './index.module.less'

@connect((state) => ({
  // xxx: state.xxx
}), { ...actions })
@CSSModules(styles)
class MaterialManage extends React.Component {
  render() {
    return (
      <div styleName="module-wrap">
        多模块示例：素材管理模块
      </div>
    )
  }
}

export default MaterialManage;
