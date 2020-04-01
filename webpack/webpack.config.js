const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = require('../config/paths');

const isProduction = process.env.NODE_ENV === 'production';

const rules = () => ([{
    test: /\.(ico|gif|png|jpe?g|svg)$/,
    loaders: [{
      loader: 'file-loader',
      options: {
        name: 'static/img/[path][name].[ext]',
        context: PATHS.CLIENT_DIR
      }
    }]
  },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: {
      customize: require.resolve(
        'babel-preset-react-app/webpack-overrides'
      ),
      presets: ['react-app'],
      plugins: [
        [
          require.resolve('babel-plugin-named-asset-import'),
          {
            loaderMap: {
              svg: {
                ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
              },
            },
          },
        ],
      ],
      cacheDirectory: true,
      // Save disk space when time isn't as important
      cacheCompression: true,
      compact: true,
    }
  },
  {
    test: /\.html$/,
    use: [{
      loader: 'html-loader',
      options: {
        minimize: false
      }
    }]
  },
  {
    test: /\.(sa|sc|c)ss$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
    include: PATHS.CLIENT_DIR
  }
]);

const resolve = () => ({
  extensions: ['*', '.js', '.jsx', '.css', '.scss']
});


const plugins = () => ([
  new ManifestPlugin({
    fileName: 'manifest.json'
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[hash:6].css',
    chunkFilename: '[id].[hash:6].css',
    minimize: true
  }),
  new HtmlWebPackPlugin({
    template: path.join(PATHS.CLIENT_DIR, 'index.html'),
    filename: './index.html'
  }),
  new webpack.HotModuleReplacementPlugin()
]);

const devServer = () => ({
  contentBase: PATHS.BUILD_DIR,
  hot: true,
  port: 3000
});

const config = {
  entry: path.join(PATHS.CLIENT_DIR, 'index.js'),
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: rules()
  },
  resolve: resolve(),
  output: {
    path: PATHS.BUILD_DIR,
    publicPath: '/',
    filename: '[name].[hash:6].js'
  },
  plugins: plugins()
};

if (!isProduction) config.devServer = devServer();

module.exports = config;
