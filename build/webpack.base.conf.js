const path = require('path')
const { argv } = require('yargs')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const resolve = (_path) => {
  return path.resolve(__dirname, `../${_path}`)
}

const webpackConfig = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@static': resolve('src/static'),
      '@components': resolve('src/components'),
      '@helpers': resolve('src/helpers'),
      '@builtin-modules': resolve('src/builtin-modules'),
      '@micro-modules': resolve('micro-modules/repos')
    }
  },
  node: {
    fs: 'empty',
    net: 'empty',
    module: 'empty',
    child_process: 'empty',
    tls: 'empty'
  },
  // 调整webpack文件大小限制 避免多余的警告
  performance: {
    maxEntrypointSize: 524288,
    maxAssetSize: 2097152
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader?cacheDirectory=true',
        include: [resolve('src'), resolve('micro-modules/repos')],
        exclude: [
          resolve('node_modules')
        ],
      },
      {
        test: /\.(png|jpe?g|gif|ico)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin()
  ]
}

if (argv.pre === 'yes') {
  webpackConfig.module.rules.unshift({
    test: /\.(js|jsx)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src')],
    options: {
      formatter: require('eslint-friendly-formatter')
    }
  })
}

module.exports = webpackConfig
