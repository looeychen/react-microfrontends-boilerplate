import React from 'react'
import PageRoutes from './components/pageRoutes'
import { withRouter, Link } from "react-router-dom"
import CSSModules from 'react-css-modules';
import styles from '@static/css/main.module.less';

@CSSModules(styles)
class Main extends React.Component {
  render() {
    const { location, store } = this.props
    const pageProps = {}

    return (
      <div styleName="page-container">
        <ul styleName="page-side">
          <li><Link to="/">内置模块-首页</Link></li>
          <li><Link to="/user/info">用户模块-用户信息</Link></li>
          <li><Link to="/user/setting">用户模块-用户设置</Link></li>
          <li><Link to="/material-manage">素材模块</Link></li>
          <li><Link to="/menu-manage">菜单模块</Link></li>
        </ul>
        <div styleName="page-content">
          <PageRoutes location={location} pageProps={pageProps} store={store} />
        </div>
      </div>
    )
  }
}

export default withRouter(Main);
