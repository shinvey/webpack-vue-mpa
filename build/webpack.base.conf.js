/**
 * # todo 打包性能优化参考
 * * https://juejin.im/post/5af3be6d6fb9a07ab458a393
 *
 * # 性能测试
 * * Performance Tester网络加载性能测试工具<https://github.com/pod4g/hiper>
 *
 * # todo 图片压缩处理
 * * https://github.com/imagemin/imagemin
 * * todo webp低版本浏览器兼容<http://webpjs.appspot.com/>
 * * [Using WebP Images](https://css-tricks.com/using-webp-images/)
 * * [WebP进阶篇--Gif2WebP](https://www.jianshu.com/p/07b39da3f0c3)
 *
 */

module.exports = (args = {}) => {
  const mode = args.mode || 'development';
  const devMode = mode !== 'production';

  const { join, resolve } = require('path');

  const packageJSON = require("../package.json");
  const merge = require('webpack-merge');
  const webpack = require('webpack');
  const webpackResolver = require('./webpack.resolver');

  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const vuxLoader = require('vux-loader');
  const vueLoaderConfig = require('./vue-loader.conf')(args);

  // const VueLoaderPlugin = require('vue-loader/lib/plugin');
  // const { VueLoaderPlugin } = require('vue-loader');

  function myResolve(dir) {
    return join(__dirname, '..', dir);
  }

  // eslint rule
  const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [myResolve('src'), myResolve('test')],
    options: {
      formatter: require('eslint-friendly-formatter'),
      emitWarning: true
    }
  });

  const multiplePages = require('./multiplePages')(mode);

  const config = {
    mode: mode,
    entry: multiplePages.entries,
    output: {
      path: resolve(__dirname, '../dist'),
      filename: 'assets/js/[name].[hash:7].js',
      /**
       * 翻阅文档，尽量使用相对路径publicPath
       * @see https://webpack.js.org/configuration/output/#output-publicpath
       * 相关配置ExtractTextPlugin中的publicPath用来解决css中相对路径引用问题
       * @see https://www.npmjs.com/package/extract-text-webpack-plugin#extract
       */
      publicPath: ''
    },
    module: {
      rules: [
        createLintingRule(),
        // css loaders
        // {
        //   test: /\.(le|c)ss$/,
        //   use: [
        //     !devMode || args.debug ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        //     'css-loader',
        //     'postcss-loader',
        //     'less-loader',
        //   ],
        // },
        {
          test: /\.vue$/,
          loader: "vue-loader",
          // options: {
          //   transformAssetUrls: {
          //     video: ['src', 'poster'],
          //     source: 'src',
          //     img: 'src',
          //     image: 'xlink:href'
          //   }
          // },
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: file => (
            /node_modules/.test(file) &&
            !/\.vue\.js/.test(file)
          )
        },
        {
          test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
          exclude: /favicon\.png$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/img/[name].[hash:7].[ext]'
            }
          }]
        }
      ]
    },
    optimization: {
      // https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-1
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
          }
        }
      }
    },
    /**
     * https://webpack.js.org/configuration/performance/
     * For example if you have an asset that is over 250kb, webpack will emit a warning notifying you of this.
     */
    /*performance: {
      hints: false
    },*/
    plugins: [
      // https://vue-loader.vuejs.org/guide/#manual-configuration
      // make sure to include the plugin!
      // new VueLoaderPlugin(),

      ...multiplePages.htmlWebpackPluginArray,

      // https://github.com/webpack-contrib/mini-css-extract-plugin#advanced-configuration-example
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
      }),

      // expose WSAPI_ENV环境变量，改变量在package.json > scripts中由cross-env定义
      new webpack.DefinePlugin({
        'process.env.WSAPI_ENV': JSON.stringify(process.env.WSAPI_ENV),
        'process.env.APP_VERSION': JSON.stringify(packageJSON.version)
      })
    ]
  };
  /**
   * vux UI组件库的vux loader配置
   *
   */
  return vuxLoader.merge(merge(config, webpackResolver), {
    plugins: [
      'vux-ui',
      {
        name: 'duplicate-style',
        options: {
          cssProcessorOptions : {
            safe: true,
            zindex: false,
            autoprefixer: {
              add: true,
              "browsers": packageJSON.browserslist
            }
          }
        }
      },
      // {
      //   name: 'less-theme',
      //   path: 'src/components/page/theme.less' // 相对项目根目录路径
      // }
    ]
  });
};
