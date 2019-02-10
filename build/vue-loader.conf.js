module.exports = args => {
  'use strict';
  const utils = require('./utils');
  const isProduction = args.mode === 'production';
  return {
    loaders: utils.cssLoaders({
      sourceMap: isProduction,
      // 是否导出可以确定css加载顺序，但是会影响web-dev-server工作，建议使用css modules解决方案
      extract: isProduction,
      usePostCSS: isProduction,
    }),
    cssSourceMap: isProduction,
    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    transformToRequire: {
      video: ['src', 'poster'],
      source: 'src',
      img: 'src',
      image: 'xlink:href'
    }
  }
};
