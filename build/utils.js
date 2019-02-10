'use strict';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

exports.cssLoaders = function (options) {
  options = options || {};

  // const styleLoader = {
  //   loader: 'style-loader',
  //   options: {
  //     singleton: true,
  //   }
  // };

  const vueStyleLoader = {
    loader: 'vue-style-loader',
    options: {
    }
  };

  const MiniCssLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
      // you can specify a publicPath here
      // by default it use publicPath in webpackOptions.output
      publicPath: '../../',
    }
  };

  const cssLoader = {
    loader: 'css-loader',
    options: {
      // https://github.com/webpack-contrib/css-loader#modules
      // modules: true,
      localIdentName: '[name]__[local]--[hash:base64:5]',
      sourceMap: options.sourceMap
    }
  };

  let postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    // const loaders = [MiniCssLoader, cssLoader];
    const loaders = [
      // options.extract ? MiniCssLoader : 'vue-style-loader',
      options.extract ? MiniCssLoader : vueStyleLoader,
      cssLoader,
    ];
    options.usePostCSS && loaders.push(postcssLoader);
    // const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    return loaders;
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less')
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options);
  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};
