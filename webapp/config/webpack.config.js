const path = require('path');
const fs = require('fs');

const APP_DIR = path.dirname(__dirname); // webapp
const BUILD_DIR = path.resolve(APP_DIR, 'build');

module.exports = {
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(APP_DIR, 'public'),
  },
  entry: path.join(APP_DIR, 'src', 'index.tsx'),
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.jsx?/,
        include: APP_DIR,
        use: ['babel-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true, // true outputs JSX tags
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        include: APP_DIR,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        include: APP_DIR,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
