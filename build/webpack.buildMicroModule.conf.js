const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { argv } = require('yargs')
const config = require('../config')

const baseWebpackConfig = require('./webpack.base.conf')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

const sourcemap = argv.sourcemap !== undefined ? !!argv.sourcemap : config.build.productionSourceMap

const { microModule } = argv

//如果microModule为多级目录
let microModuleName = microModule
if (microModule.indexOf('/') > -1) {
  microModuleName = microModuleName.replace(/\//g, '_')
}

const dllManifestDir = path.resolve(__dirname, './manifest/prod')
const microModuleDir = path.resolve(__dirname, `../dist/micro-modules/${microModule}`)

const webpackConfig = merge(baseWebpackConfig, {
  bail: true,
  mode: 'production',
  devtool: '#source-map',
  entry: {
    [microModuleName]: path.resolve(__dirname, `../micro-modules/repos/${microModule}`),
  },
  output: {
    path: microModuleDir,
    filename: '[name]-[chunkhash:8].js',
    publicPath: `/micro-modules/${microModule}/`,
    chunkFilename: 'js/chunks/[chunkhash:8].js',
    jsonpFunction: `webpackJsonpMicroModule__${microModuleName}_`,
    library: 'microModule_[name]',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: new RegExp(`^(.*\\.module).*\\.less`),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[local]--[hash:base64:5]',
            }
          },
          {
            loader: 'less-loader',
            options: {
              importLoaders: 2,
              modules: true,
              localIdentName: '[local]--[hash:base64:5]',
            },
          },
        ]
      },
      {
        test: new RegExp(`^(?!.*\\.module).*\\.less`),
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: sourcemap
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new LodashModuleReplacementPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['en-gb', 'zh-cn', 'es-us', 'ru']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[chunkhash:8].min.css'
    }),
    new webpack.DllReferencePlugin({
      context: dllManifestDir,
      manifest: require(path.join(dllManifestDir, 'vendor-manifest.json'))
    }),
    new CleanWebpackPlugin([microModuleDir], {
      allowExternal: true,
      exclude: []
    })
  ]
})

module.exports = webpackConfig
