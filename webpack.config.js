const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: [
    'whatwg-fetch',
    './src/client/app.js',
    './src/client/styles.scss'
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
        loader: ExtractTextPlugin.extract('css-loader!autoprefixer-loader!sass-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css', {allChunks: false})
  ],
  devTool: 'source-map'
};
