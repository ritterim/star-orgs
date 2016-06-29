const path = require('path');

module.exports = {
  entry: './src/client/app.js',
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
      }
    ]
  },
  devTool: 'source-map'
};
