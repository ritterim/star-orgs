const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');

dotenv.config({ silent: true });

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
          path.resolve(process.cwd(), 'src')
        ],
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      "IMAGE_RETRIEVER"
    ])
  ],
  devTool: 'source-map'
};
