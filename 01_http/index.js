'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url');

// 业务逻辑处理
function handler(req, res) {
  const urlObj = URL.parse(req.url, true);
  const pathName = urlObj.pathname;

  // 打印访问日志
  console.log(`visit ${req.url}`);

  // 根据 URL 返回不同的内容
  if (pathName === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
    const html = fs.readFileSync(path.join(__dirname, 'public/index.html'));
    return res.end(html);
  }

  if (pathName === '/api/projects') {
    const data = {
      list: [ 'Node', 'Koa', 'Egg' ],
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data, null, 2));
  }

  if (pathName === '/api/projects/detail') {
    const name = urlObj.query.name || 'unknown';
    const data = {
      name,
      desc: `this is detail of ${name}`,
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data, null, 2));
  }

  // 兜底处理
  res.statusCode = 404;
  res.end(`${req.url} not found`);
}

// 启动服务
const server = http.createServer(handler);
server.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
