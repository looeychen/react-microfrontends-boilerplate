process.env.NODE_ENV = 'production'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const { argv } = require('yargs')

let webpackConfig = null
if (argv.buildMode === 'micromodule') {
  webpackConfig = require(`./webpack.buildMicroModule.conf`)
} else {
  webpackConfig = require('./webpack.prod.conf')
}

console.log(chalk.cyan('building for production...\n'))

const utils = {
  //获取打包文件md5版本
  getFileMd5Version: (buildDir, fileName) => {
    let md5Version = ''
    if (fs.statSync(buildDir).isDirectory()) {
      const files = fs.readdirSync(buildDir)
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const regExp = new RegExp('^' + fileName.replace('-', '\-') + '\-(\\w{8})\.js$')
        const filePath = file.match(regExp)
        if (filePath) {
          md5Version = filePath[1]
          break;
        }
      }
    }
    return md5Version
  },
  //读取package.json
  getJsonFile: (jsonFilePath) => {
    let json = null
    const jsonFile = fs.readFileSync(jsonFilePath)
    if (jsonFile) {
      const jsonFileBuffer = jsonFile.toString()
      json = JSON.parse(jsonFileBuffer)
    }
    return json
  },
  //更新package.json
  updateJsonFile: (jsonFilePath, json) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(json))
  }
}

webpack(webpackConfig, (err, stats) => {
  if (err) throw err
  process.stdout.write(`${stats.toString({
    colors: true,
    modules: true,
    children: false,
    chunks: true,
    chunkModules: false
  })}\n\n`)

  //构建微前端模块
  if (argv.buildMode === 'micromodule') {
    const moduleName = argv.microModule; //模块名称
    let modulebuildName = moduleName

    //如果moduleName为多级目录
    if (moduleName.indexOf('/') > -1) {
      modulebuildName = moduleName.replace(/\//g, '_')
    }
    const modulePackageJsonPath = path.resolve(__dirname, `../micro-modules/repos/${moduleName}/package.json`)
    const modulePackageJson = utils.getJsonFile(modulePackageJsonPath)
    if (modulePackageJson && modulePackageJson.moduleInfo && modulePackageJson.moduleInfo.path) {

      //模块path
      const modulePath = modulePackageJson.moduleInfo.path;

      //模块打包md5版本号
      const buildModuleDir = path.join(__dirname, `../dist/micro-modules/${moduleName}`)
      const moduleMd5Version = utils.getFileMd5Version(buildModuleDir, modulebuildName)

      //是否有独立css文件
      const moduleHasCssFile = !!fs.existsSync(path.join(__dirname, `../dist/micro-modules/${moduleName}/css/${modulebuildName}-${moduleMd5Version}.min.css`))

      //更新config.json
      if (moduleName && modulePath && moduleMd5Version) {
        const configPath = path.join(__dirname, `../dist/micro-modules/modules.json`)
        const existConfigFile = fs.existsSync(configPath)
        if (existConfigFile) {
          const configJson = utils.getJsonFile(configPath)
          const moduleConfig = configJson.find(module => module.moduleName === moduleName)
          if (moduleConfig) {
            moduleConfig.modulePath = modulePath
            moduleConfig.moduleMd5Version = moduleMd5Version
            moduleConfig.moduleHasCssFile = moduleHasCssFile
          } else {
            configJson.push({
              moduleName: moduleName,
              modulePath: modulePath,
              moduleMd5Version: moduleMd5Version,
              moduleHasCssFile: moduleHasCssFile
            })
          }
          utils.updateJsonFile(configPath, configJson)
        } else {
          fs.writeFileSync(configPath, JSON.stringify([{
            moduleName: moduleName,
            modulePath: modulePath,
            moduleMd5Version: moduleMd5Version,
            moduleHasCssFile: moduleHasCssFile
          }]))
        }
      }
    }
  }

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow('  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'))
})
