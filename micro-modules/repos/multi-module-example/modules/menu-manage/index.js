import Route from './route/index'
import Reducers from './redux/reducers'
import DesignerComponent from './views/index'

const packageJson = require('./package.json')

export default {
  moduleOutputComponent: DesignerComponent,
  moduleRoute: Route,
  moduleReducers: Reducers,
  modulePath: packageJson.moduleInfo.path
}
