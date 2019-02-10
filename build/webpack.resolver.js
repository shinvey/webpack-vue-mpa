/**
 * 配置webpack路径别名。
 * 同时又可以给webstorm提供为代码中的import语句提供路径解析参照。
 *
 * 具体如何配置webstorm可以查看
 * https://stackoverflow.com/questions/34943631/path-aliases-for-imports-in-webstorm
 *
 * Webstorm配置建议，找到 Settings | Languages & Frameworks | JavaScript | Webpack，
 * 并将webpack configuration file路径z指向当前文件
 */

const path = require('path');
module.exports = {
  resolve: {
    alias: {
      assets: path.resolve(__dirname, '../src/assets'),
      components: path.resolve(__dirname, '../src/components')
    },
    extensions: ['.js', '.vue', '.json']
  }
};
