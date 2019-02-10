const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

module.exports = (mode) => {
  const entries = {};
  const chunks = [];
  const htmlWebpackPluginArray = [];
  const resPath = './src';
  // @todo main js file shouldn't be limited
  glob.sync(`${resPath}/pages/**/app.js`).forEach(path => {
    const chunk = path.split(`${resPath}/pages/`)[1].split('/app.js')[0];
    entries[chunk] = path;
    chunks.push(chunk);

    const filename = chunk + '.html';
    let htmlConf = {
      filename: filename,
      template: path.replace(/.js/g, '.html'),
      // inject: 'body', // true or body 为默认值
      // favicon: `${resPath}/assets/img/favicon.ico`,
      meta: {
        viewport: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no',
        charset: {
          charset: 'utf-8'
        }
      },
      chunks: ['vendors', 'commons', chunk],
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency',
    };

    if (mode === 'production') {
      htmlConf = {
        ...htmlConf,
        // hash: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
      };
    }

    htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
  });
  return {
    entries,
    htmlWebpackPluginArray
  };
};
