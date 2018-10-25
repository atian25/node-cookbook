'use strict';

const fs = require('fs');
const path = require('path');
const URL = require('url');

const Cell = require('./lib/cell');
const app = new Cell();

// 根据 URL 返回不同的内容

// 打印访问日志
app.use((req, res, next) => {
  console.log(`visit ${req.url}`);
  next(); // 继续执行后续逻辑
});

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
  const html = fs.readFileSync(path.join(__dirname, 'public/index.html'));
  return res.end(html);
});

app.get('/api/projects', (req, res) => {
  const data = {
    list: [ 'Node', 'Koa', 'Egg' ],
  };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data, null, 2));
});

app.get('/api/projects/detail', (req, res) => {
  const urlObj = URL.parse(req.url, true);
  const name = urlObj.query.name || 'unknown';
  const data = {
    name,
    desc: `this is detail of ${name}`,
  };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data, null, 2));
});

// 兜底处理
app.use((req, res) => {
  res.statusCode = 404;
  res.end(`${req.url} not found`);
});

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
