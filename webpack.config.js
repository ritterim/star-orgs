const dotenv = require('dotenv');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

dotenv.config({ silent: true });

const isProd = process.env.NODE_ENV === 'production';

const plugins = [
  new ExtractTextPlugin('style.css', {allChunks: false}),
  new webpack.EnvironmentPlugin([
    'GOOGLE_ANALYTICS_TRACKING_ID'
  ])
];

if (isProd) {
  plugins.push(...[
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]);
}

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
  plugins: plugins,
  devTool: 'source-map'
};
