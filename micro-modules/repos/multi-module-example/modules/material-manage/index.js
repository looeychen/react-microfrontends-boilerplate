import Route from './route/index'
import Reducers from './redux/reducers'
import PreviewComponent from './views/index'

const packageJson = require('./package.json')

export default {
  moduleOutputComponent: PreviewComponent,
  moduleRoute: Route,
  moduleReducers: Reducers,
  modulePath: packageJson.moduleInfo.path
}
