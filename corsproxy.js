/**
 * 跨域访问代理服务
 * @date 11/6/2015
 * @author <a href="mailto:ex-huxinwei001@pingan.com.cn">Shinvey Hu</a>
 */
// Heroku defines the environment variable PORT, and requires the binding address to be 0.0.0.0
var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
var port = process.env.PORT || 8080;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    // maxRedirects: 0,
    // redirectSameOrigin: true,
    /*httpProxyOptions : {
        changeOrigin: true,
        autoRewrite: true
    },*/
    originWhitelist: [], // Allow all origins
    // requireHeader: ['origin', 'x-requested-with'],//项目中一些请求没有这两个请求头，这里不做严格限制
    // removeHeaders: ['cookie', 'cookie2'] //除去列表中指定的http header
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});