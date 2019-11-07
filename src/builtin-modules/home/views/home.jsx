import React from 'react'
import CSSModules from 'react-css-modules'
import connect from 'redux-connect-decorator'
import { actions } from '../redux/modules/home'
import styles from './home.module.less';

@connect((state) => ({
  // xxx: state.xxx
}), { ...actions })
@CSSModules(styles)
class Home extends React.Component {
  render() {
    return (
      <div styleName="module-wrap">
        内置模块示例：首页
      </div>
    )
  }
}

export default Home;
