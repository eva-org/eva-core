const path = require('path')
module.exports = {
  mode: 'development',
  entry: './output/index.js',
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  devtool: 'source-map',
  node: {
    global: true
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}
