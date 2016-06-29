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
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  externals: {
    md5: 'md5'
  },
  devTool: 'source-map'
};
