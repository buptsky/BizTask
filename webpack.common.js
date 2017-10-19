const theme = require('./theme');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: {
    app: './src/index.js',
    vendor: ['axios', 'immutable', 'moment', 'react', 'react-dom',
      'react-redux', 'react-router', 'redux', 'redux-thunk'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/static/pc/dist/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: "css-loader"
      })
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract([{
        loader: "css-loader"
      }, {
        loader: "less-loader",
        options: {
          modifyVars: theme
        }
      }])
    }, {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {}
        }
      ]
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      moment: 'moment',
      Immutable: 'immutable',
      _: 'lodash',
      storeJS: 'store'
    }),
    new ExtractTextPlugin('[name].css')
  ],
  devtool: 'source-map'
};
