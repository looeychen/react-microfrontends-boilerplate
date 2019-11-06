const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const config = require('../config')

const _PROP = process.env.NODE_ENV === 'production'
const dllDir = path.join(__dirname, `./dll/${_PROP ? 'prod' : 'dev'}`)
const manifestDir = path.join(__dirname, `./manifest/${_PROP ? 'prod' : 'dev'}`)

const entry = {
  vendor: [
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'redux',
    'react-redux',
    'react-router-redux',
    'react-css-modules'
  ]
}

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: entry,
  output: {
    path: dllDir,
    filename: _PROP ? '[name].[chunkhash:8].js' : '[name].js',
    library: '[name]'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  plugins: [
    new ProgressBarPlugin(),
    new CleanWebpackPlugin([dllDir, manifestDir], {
      allowExternal: true
    }),
    new webpack.DllPlugin({
      path: `${manifestDir}/[name]-manifest.json`,
      name: '[name]',
      context: manifestDir
    })
  ]
}

if (_PROP) {
  webpackConfig.output.publicPath = '/static/js/dll/'
  webpackConfig.plugins.splice(1, 0, new webpack.HashedModuleIdsPlugin())
  if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')
    webpackConfig.plugins.push(new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(`\\.(${
        config.build.productionGzipExtensions.join('|')
        })$`),
      threshold: 10240,
      minRatio: 0.8
    }))
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    filename: '../../../src/static/index-template.html',
    template: path.resolve(__dirname, '../src/static/index-dll-template.html'),
    minify: {},
    inject: 'body'
  }))
}

module.exports = webpackConfig
