const config = require('../config')
const { argv } = require('yargs')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config[argv.prod ? 'build' : 'dev'].env.NODE_ENV)
}

const os = require('os')
const opn = require('opn')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')
const host = config.dev.host
const port = argv.port || process.env.PORT || config.dev.port
const autoOpenBrowser = !!config.dev.autoOpenBrowser

// 配置代理
const { proxyTable } = config.dev
if (argv.proxy) {
  proxyTable['/api'].target = argv.proxy
}

const IP = (function () {
  const interfaces = os.networkInterfaces()
  let IPv4 = '127.0.0.1'
  for (const key in interfaces) {
    interfaces[key].forEach((details) => {
      if (details.family === 'IPv4' && details.address.indexOf('10.5') > -1) {
        IPv4 = details.address
      }
    })
  }
  return IPv4
}())

const uri = `http://${host ? host : IP}:${port}`

const app = express()

// proxy api requests
Object.keys(proxyTable).forEach((context) => {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

if (argv.prod) {
  const ejs = require('ejs')
  const compression = require('compression')
  const distPath = 'dist'

  app.use(compression());
  app.set('views', distPath)
  app.set('view engine', 'html');
  app.engine('html', ejs.renderFile);

  app.use('/static', express.static(`./${distPath}/static`))
  app.use('/micro-modules', express.static(`./${distPath}/micro-modules`))

  app.get('/', function (req, res) {
    res.render('index')
  });

  app.get('*', function (req, res) {
    res.render('index')
  });

  console.log(`\n> Listening at ${uri}\n`)
} else {
  const compiler = webpack(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    quiet: true,
    stats: {
      colors: true
    }
  })

  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: console.log
  })

  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  // handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')())

  // serve webpack bundle output
  app.use(devMiddleware)

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware)

  // serve pure static assets
  app.use('/static', express.static('./static'))
  app.use('/build', express.static('./build'))
  app.use('/micro-modules', express.static('./micro-modules'))

  devMiddleware.waitUntilValid(() => {
    console.log(`> Listening at ${uri}\n`)
  })
}

module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser) {
    opn(uri)
  }
})
