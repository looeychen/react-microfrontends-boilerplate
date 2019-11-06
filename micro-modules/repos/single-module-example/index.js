import Route from './route/index'
import Reducers from './redux/reducers'

const packageJson = require('./package.json')

export default {
  moduleRoute: Route,
  moduleReducers: Reducers,
  modulePath: packageJson.moduleInfo.path
}
