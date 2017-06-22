const path = require('path')
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const srcPath = path.resolve(__dirname, 'src/js')
const outputPath = path.resolve(__dirname, 'public/dist')

module.exports = {
  context: srcPath,
  entry: {
    'index': './index.js',
    'style': '../css/style.styl'
  },
  output: {
    path: outputPath,
    filename: "[name].js",
    publicPath: "/public/"
  },
  module: {
    rules: [
      { test: /\.es6$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }) },
      { test: /\.styl$/, loader: ExtractTextPlugin.extract({ fallback: 'stylus', use: 'css-loader!stylus-loader?paths=node_modules/boostrap-stylus/stylus/' }) },
    ]
  },
  plugins: [
    new ExtractTextPlugin("./css/style.css"),
  ]
}
