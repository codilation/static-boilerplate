const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const files = fs.readdirSync('./src/templates');
const templates = [];
files.forEach(file => {
  templates.push(new HtmlWebpackPlugin({
    template: `./src/templates/${file}`,
    inject: true,
    chunks: ['index'],
    filename: `${file.slice(0, -4)}.html`
  }));
});

module.exports = {
  entry: ['./src/js/main.js', './src/css/main.css'],
  mode: 'development',
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  stats: false,
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.hbs/,
        loader: "handlebars-loader",
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '../fonts'
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {importLoaders: 1},
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: loader => [
                  require('postcss-partial-import'),
                  require('postcss-preset-env')({
                    stage: 0
                  }),
                  require('postcss-hexrgba'),
                  require('autoprefixer'),
                  require('postcss-nested'),
                  require('iconfont-webpack-plugin')({
                    resolve: loader.resolve,
                    enforcedSvgHeight: 100,
                  })
                ]
              },
            },
          ],
        }),
      }
    ]
  },
  plugins: [
    ...templates,
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    }),
    new CleanWebpackPlugin(['dist'], {
      root: process.cwd()
    }),
    new CopyWebpackPlugin([{
      from: 'src/images',
      to: 'images'
    }]),
    new ExtractTextPlugin('css/bundle.css'),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      open: false,
      ghostMode: false,
      notify: true,
      server: {
        baseDir: ['dist']
      }
    })
  ],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
};