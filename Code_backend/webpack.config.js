const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './app.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname),
    filename: 'server.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new Dotenv()
  ],
};