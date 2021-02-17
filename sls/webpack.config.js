const path = require('path');
const slsWebpack = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  externals: [nodeExternals()],
  devtool: 'source-map',
  entry: slsWebpack.lib.entries,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    plugins: [new tsconfigPathsPlugin({ configFile: 'tsconfig.base.json' })],
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [],
  mode: slsWebpack.lib.webpack.isLocal ? 'development' : 'production',
  stats: 'minimal', // errors-only, minimal, none, normal, verbose
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
