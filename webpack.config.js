const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/client/app.js'
  ],
  output: {
    path: './public/lib',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },

      // https://github.com/gowravshekar/font-awesome-webpack/tree/48a9151238e6ebe382301512a48183a7ae057f62#usage
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css')
  ],
  devTool: 'source-map'
};
