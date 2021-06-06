const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const config = require('./webpack.config');

const mode = 'production';

const common = {
  mode,
  devtool: undefined,
  stats: {
    ...config[2].stats,
    modules: true,
  },
};

const rendererConfig = {
  ...config[2],
  ...common,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            passes: 3,
            drop_console: true,
            ecma: 8,
          },
          mangle: {
            properties: {
              regex: /^\$\w+/,
            },
          },
          ecma: 8,
          module: true,
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
};

const mainConfig = {
  ...config[0],
  ...common,
};

const preloadConfig = {
  ...config[1],
  ...common,
};

module.exports = [mainConfig, preloadConfig, rendererConfig];
