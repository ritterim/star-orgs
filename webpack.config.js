const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

dotenv.config({ silent: true });

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/client/app.js'
    './src/client'
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
          path.resolve(process.cwd(), 'src')
        ],
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader', 'css-loader!autoprefixer-loader!sass-loader'
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      "IMAGE_RETRIEVER"
    ]),
    new ExtractTextPlugin('style.css', {allChunks: false})
  ],
  devTool: 'source-map'
};
