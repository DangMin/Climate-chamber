const path = require('path')
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

const srcPath = path.resolve(__dirname, 'src/js')
const outputPath = path.resolve(__dirname, 'public/dist')

module.exports = {
  context: srcPath,
  entry: {
    'index': './index.js',
    'style': '../css/style.styl',
  },
  output: {
    path: outputPath,
    filename: "[name].js",
  },
  module: {
    rules: [
      { test: /\.es6$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' }
      ] },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!stylus-loader' })
      },
      { test: /\.(png|jpg|gif|svg|ttf)$/, loader: 'url-loader'}
    ]
  },
  plugins: [
    new ExtractTextPlugin("./css/style.css"),
    new DashboardPlugin()
  ],
  resolve: {
    extensions: ['.js'],
    modules: [srcPath, "node_modules"],
    //mainFields: ["loader", "main"]
  },
  resolveLoader: {
    //extensions: ['js'],
    modules: ["node_modules"],
    //mainFields: ["loader", "main"]
  },
  watch: true
}
