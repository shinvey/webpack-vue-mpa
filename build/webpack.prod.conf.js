module.exports = (env, args) => {
  'use strict';
  const { resolve } = require('path');
  const webpack = require('webpack');
  const merge = require('webpack-merge');

  const packageJSON = require("../package.json");
  const utils = require('./utils');
  const baseWebpackConfig = require('./webpack.base.conf')(args);

  const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
  const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
  const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
  const FileManagerPlugin = require('filemanager-webpack-plugin');

  const prodWebpackConfig = merge(baseWebpackConfig, {
    module: {
      rules: [
        ...utils.styleLoaders({
          sourceMap: true,
          extract: true,
          usePostCSS: true
        }),
        // 配合publicPath使用 https://www.npmjs.com/package/html-loader
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              root: resolve(__dirname, 'src'),
              attrs: ['img:src', 'link:href']
            }
          }]
        },
      ]
    },
    devtool: '#source-map',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSPlugin(),
      ]
    },
    plugins: [
      // extractCSS,

      // https://github.com/lodash/lodash-webpack-plugin
      new LodashModuleReplacementPlugin,

      // enable scope hoisting, automatically enabled in production
      // new webpack.optimize.ModuleConcatenationPlugin(),
      // keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin(),
    ]
  });

  if (args.profile) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    prodWebpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }

  // 目录清理
  let fileManagerOptions = {
    onStart: {
      delete: [
        './dist'
      ]
    }
  };
  // zip打包
  if (args.zip) {
    fileManagerOptions = merge(fileManagerOptions, {
      onEnd: {
        mkdir: ['./zip'],
        archive: [
          { source: './dist', destination: `./zip/${packageJSON.name}-${process.env.WSAPI_ENV || args.mode}-${packageJSON.version}.zip` },
          { source: './dist', destination: `./zip/${packageJSON.name}.latest.zip` }
        ]
      }
    })
  }
  prodWebpackConfig.plugins.push(new FileManagerPlugin(fileManagerOptions));

  return prodWebpackConfig;
};
