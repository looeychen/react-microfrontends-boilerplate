import React from 'react'
import PropTypes from 'prop-types'
import { combineReducers } from 'redux'
import { Switch, Route } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import axios from 'axios'
import { DEV, microModulesApiUrl } from '../../../config'

import HomeModule from '@builtin-modules/home'
import NotMatch from '@components/notMatch'

require('@helpers/loadScript')

//根据location获取模块path
const getModulePath = (location) => {
  let modulePath = ''
  const locationModulePath = location.pathname.match(/^\/([^/]+)/)

  if (locationModulePath && Array.isArray(locationModulePath) && locationModulePath[1]) {
    modulePath = `${locationModulePath[1]}`
  }

  return `/${modulePath}`
}

//动态注册微前端模块Reducers
const registerModuleReducers = (reducers, store) => {
  const reducerModules = reducers && Object.keys(reducers)
  reducerModules.forEach((key) => {
    store.reducers[key] = reducers[key]
  })
  store.replaceReducer(combineReducers(store.reducers))
}

// 加载微前端模块
const loadModule = (enabledModules, moduleName, store) => {
  const currMicroModule = enabledModules.find(mod => mod.moduleName === moduleName)
  return new Promise((resolve) => {
    let microModule = null
    if (DEV) {
      microModule = require(`@micro-modules/${moduleName}`).default
      if (microModule) {
        microModule.moduleReducers && registerModuleReducers(microModule.moduleReducers, store)
        resolve({ moduleName, microModule })
      }
    } else {
      let modulebuildName = moduleName
      //如果moduleName为多级目录
      if (moduleName.indexOf('/') > -1) {
        modulebuildName = moduleName.replace(/\//g, '_')
      }

      loadScript(`/micro-modules/${moduleName}/${modulebuildName}-${currMicroModule.moduleMd5Version}.js`, () => { /* eslint-disable-line no-undef */
        const microModuleLib = window[`microModule_${modulebuildName}`]
        microModule = (microModuleLib && microModuleLib.default) || null
        if (microModule) {
          microModule.moduleReducers && registerModuleReducers(microModule.moduleReducers, store)
          resolve({ moduleName, microModule })
        }
      }, { loadCss: currMicroModule.moduleHasCssFile, cssDir: 'css' })
    }
  })
}


class PageRoutes extends React.Component {
  static propTypes = {
    terminal: PropTypes.bool,
    pageProps: PropTypes.object,
    location: PropTypes.object,
    store: PropTypes.object,
  };

  constructor(props) {
    super(props)

    //加载的模块
    this.enabledModules = []

    //内置模块
    this.builtinModules = [
      HomeModule
    ]

    //记录所有模块的modulePath
    this.modulesPath = []

    //注册内置模块
    this.builtinModules.forEach(builtinModule => {
      this.modulesPath.push(builtinModule.modulePath)
      registerModuleReducers(builtinModule.moduleReducers, props.store)
    })

    this.state = {
      loadedModules: {},     //已注册的模块
      loaded: false
    }
  }

  componentDidMount() {
    axios.get(`${microModulesApiUrl}?t=${(new Date()).getTime()}`).then(({ data }) => {
      if (!Array.isArray(data)) return
      this.enabledModules = data
      this.modulesPath = this.modulesPath.concat(this.enabledModules.map(enabledModule => enabledModule.modulePath))

      //初始加载模块
      const modulePath = getModulePath(this.props.location)
      const module = this.enabledModules.find(_mod => _mod.modulePath === modulePath)
      if (module) {
        this.loadMicroModule(module.moduleName)
      } else {
        this.setState({
          loaded: true
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const modulePath = getModulePath(nextProps.location)
    const module = this.enabledModules.find(_mod => _mod.modulePath === modulePath)
    if (module && !this.state.loadedModules[module.moduleName]) {
      this.loadMicroModule(module.moduleName)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextState, this.state) || !isEqual(nextProps.location, this.props.location)) {
      return true
    }
    return false
  }

  render() {
    const { pageProps, location, store } = this.props
    const { loaded, loadedModules } = this.state
    const loadedModulesArr = Object.keys(loadedModules)
    const modulePath = getModulePath(location)

    return (
      <Switch>
        <Route path='/' exact component={() => <HomeModule.moduleRoute {...pageProps} />} />
        {
          loadedModulesArr && loadedModulesArr.map((key) => {
            const module = loadedModules[key]
            const ModuleRoute = (module && module.moduleRoute) || null
            return ModuleRoute ? (
              <Route key={module.modulePath} path={module.modulePath} component={() => <ModuleRoute {...pageProps} enabledModules={this.enabledModules} store={store} loadModule={loadModule} />} />
            ) : null
          })
        }
        {loaded && this.modulesPath.indexOf(modulePath) === -1 && <Route component={() => <NotMatch />} />}
      </Switch>
    )
  }

  // 加载微前端模块
  loadMicroModule(moduleName) {
    const { store } = this.props
    const { loadedModules } = this.state
    const currMicroModule = this.enabledModules.find(mod => mod.moduleName === moduleName)
    if (currMicroModule && !loadedModules[currMicroModule.moduleName]) {
      loadModule(this.enabledModules, currMicroModule.moduleName, store).then(({ moduleName, microModule }) => {
        this.setState(prevState => ({
          loaded: true,
          loadedModules: {
            ...prevState.loadedModules,
            [moduleName]: microModule
          }
        }))
      })
    }
  }
}

export default PageRoutes
