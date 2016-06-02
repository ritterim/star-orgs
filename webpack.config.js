module.exports = {
  entry: './src/app.js',
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
    mermaid: 'mermaidAPI',
    'svg-pan-zoom': 'svgPanZoom'
  },
  devTool: 'source-map'
};
