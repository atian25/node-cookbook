'use strict';

const fs = require('fs');
const path = require('path');

const Cell = require('./lib/cell');
const app = new Cell();

// 路由映射

// 打印访问日志
app.use((req, res, next) => {
  console.log(`visit ${req.url}`);
  next(); // 继续执行后续逻辑
});

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
  const html = fs.readFileSync(path.join(__dirname, 'app/view/index.html'));
  return res.end(html);
});

app.get('/api/projects', (req, res) => {
  const data = {
    list: [ 'Node', 'Koa', 'Egg' ],
  };
  res.json(data);
});

app.get('/api/projects/detail', (req, res) => {
  const name = req.query.name || 'unknown';
  const data = {
    name,
    desc: `this is detail of ${name}`,
  };
  res.json(data);
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
