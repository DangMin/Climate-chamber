const path = require('path')
const Webpack = require('webpack')

const srcPath = path.resolve(__dirname, 'src')
const outputPath = path.resolve(__dirname, 'public')

module.exports = {
  context: srcPath,
  entry: {
    index: './index.js'
  },
  output: {
    path: outputPath,
    filename: "[name].js",
    publicPath: "/public/"
  },
  module: {
    rules: [
      { test: /\.es6$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}
