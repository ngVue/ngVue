var path = require('path')
var fs = require('fs')
var webpack = require('webpack')

function getExampleEntries () {
  var dir = 'example'
  var entry = {}

  fs.readdirSync('./' + dir).filter(function (name) {
    return fs.statSync('./' + dir + '/' + name).isDirectory()
  }).forEach(function (name) {
    entry[name] = path.resolve(__dirname, './' + name)
  })

  return entry
}

module.exports = {
  entry: getExampleEntries(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: '[name].build.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, '../node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    port: 12345
  },
  devtool: '#eval-source-map',
  performance: {
    hints: false
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.performance = {
    hints: true
  }
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])
}
