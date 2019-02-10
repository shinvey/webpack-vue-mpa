module.exports = (env, args) => {
  'use strict';
  const webpack = require('webpack');
  const merge = require('webpack-merge');
  const utils = require('./utils');

  const baseWebpackConfig = require('./webpack.base.conf')(args);
  const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
      rules: utils.styleLoaders({
        sourceMap: false,
        usePostCSS: false,
        extract: false,
      })
    },
    // 默认 devtool: 'eval',
    // devtool: 'cheap-module-eval-source-map',
    devServer: {
      // clientLogLevel: 'warning',
      // https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback
      historyApiFallback: false,
      hot: true,
      // https://webpack.js.org/configuration/dev-server/#devserver-compress
      compress: false,
      overlay: {
        // warnings: true,
        errors: true
      },
      noInfo: false,
      // quiet: true, // necessary for FriendlyErrorsPlugin

      // if you work with vagrant or docker, enable below
      /*watchOptions: {
        poll: true
      },*/

      host: '0.0.0.0',
      port: 8010,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8011',
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        }
      },
      // open: false,
      useLocalIp: true,
      openPage: 'demo.html'
    },
    optimization: {
      noEmitOnErrors: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      // development 模式下，默认开启了NamedChunksPlugin 和NamedModulesPlugin方便调试
      // new webpack.NamedModulesPlugin() // HMR shows correct file names in console on update.
    ]
  });
  return devWebpackConfig;
};
