const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const devtool = 'inline-source-map';

const tsLoader = {
  test: /\.(ts|tsx)$/,
  loader: 'ts-loader',
  options: { transpileOnly: true },
  exclude: '/node_modules/',
};

function createEntry(from = '', filename = '[name].js') {
  return {
    import: from,
    filename,
  };
}

const extensions = ['.js', '.ts', '.tsx', '.css', '.json'];

const stats = {
  modules: false,
  reasons: false,
  moduleTrace: false,
  entrypoints: false,
};

const rendererConfig = {
  target: 'electron-renderer',
  mode: 'development',
  devtool,
  entry: {
    index: createEntry('./src/index.ts'),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.(jpg|png|wav|mp3|ogg|flac|ttf)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      tsLoader,
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  resolve: {
    extensions,
    alias: {
      src: path.resolve(__dirname, './src/'),
    },
  },
  stats,
};

const mainConfig = {
  target: 'electron-main',
  mode: 'development',
  devtool,
  entry: {
    main: createEntry('./main.ts'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './package.json',
          transform(content) {
            const { name, productName, version, description, main, author, license } = JSON.parse(content.toString());
            return JSON.stringify({ name, productName, version, description, main, author, license });
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.csv$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/data/[name].[ext]',
          },
        },
      },
      tsLoader,
    ],
  },
  resolve: {
    extensions,
    alias: {
      src: path.resolve(__dirname, './src/'),
    },
  },
};

const preloadConfig = {
  ...mainConfig,
  target: 'electron-preload',
  output: undefined,
  plugins: undefined,
  entry: {
    preload: createEntry('./src/preload.ts'),
  },
};

module.exports = [mainConfig, preloadConfig, rendererConfig];
