/**
 * 数据挡板
 * expressjs api相关信息。请查看下方url
 * @see http://expressjs.com/en/4x/api.html
 */
const compression = require('compression');
const express = require('express');
/**
 * @see https://www.npmjs.com/package/body-parser
 */
const bodyParser = require('body-parser');
/**
 * @see https://www.npmjs.com/package/url
 */
const url = require('url');

const app = express();
const port = process.env.PORT || 8011;

app.use(compression());
app.use(express.static('dist'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  /**
   * CORS 跨域资源共享协议相关配置
   * @see http://www.ruanyifeng.com/blog/2016/04/cors.html
   */
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  req.is('json') !== false && res.type('json');

  next();
});

app.post('/*', (req, res) => {
  console.log('request body ', JSON.stringify(req.body));
  const filename = url.parse(req.url).pathname.split('/').pop();
  let data;
  try {
    // eslint-disable-next-line import/no-dynamic-require
    data = require(`./data/${filename}`)();
  } catch (e) {
    data = {
      state: 500,
      message: e.message
    };
  }
  res.send( data );
});

app.listen(port, () => {
  console.log(`Running mock server on port ${port}`);
});
