const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { argv } = require('yargs')
const config = require('../config')

const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

const dllManifestDir = path.resolve(__dirname, './manifest/prod')
const sourcemap = argv.sourcemap !== undefined ? !!argv.sourcemap : config.build.productionSourceMap
const distDir = 'dist'
const staticPath = 'static'

const webpackConfig = merge(baseWebpackConfig, {
  bail: true,
  mode: 'production',
  devtool: '#source-map',
  entry: {
    main: path.resolve(__dirname, '../src/main')
  },
  output: {
    path: path.resolve(__dirname, `../${distDir}/static`),
    filename: 'js/[name].[chunkhash:8].js',
    publicPath: `/${staticPath}/`,
    chunkFilename: 'js/chunks/[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: new RegExp(`^(.*\\.module).*\\.less`),
        use: [
          'style-loader',
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
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all'
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 2
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: sourcemap
      })
    ]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new LodashModuleReplacementPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['en-gb', 'zh-cn', 'es-us', 'ru']
    }),
    new CleanWebpackPlugin([path.resolve(__dirname, `../${distDir}`)], {
      allowExternal: true,
      exclude: ['micro-modules', '.git']
    }),
    new webpack.DllReferencePlugin({
      context: dllManifestDir,
      manifest: require(path.join(dllManifestDir, 'vendor-manifest.json'))
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: path.resolve(__dirname, `../src/static/index-template.html`),
      minify: {},
      inject: 'body'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../build/dll/prod'),
        to: path.resolve(__dirname, `../${distDir}/static/js/dll`),
        ignore: ['.*']
      }
    ])
  ]
})

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

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
