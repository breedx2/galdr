const { merge } = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  entry: './src/galdr.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [ 
    new TerserPlugin()
  ]
});
