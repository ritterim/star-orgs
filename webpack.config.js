const dotenv = require('dotenv');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

dotenv.config();

const plugins = [
  new ExtractTextPlugin('style.css'),
  new webpack.EnvironmentPlugin([
    'GOOGLE_ANALYTICS_TRACKING_ID'
  ])
];

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/client/app.js',
    './src/client/styles.scss'
  ],
  output: {
    path: path.resolve(__dirname, './public/lib'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { modules: false }]
            ]
          }
        },
        include: [
          path.resolve(process.cwd(), 'src')
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: plugins,
  devtool: 'source-map'
};
