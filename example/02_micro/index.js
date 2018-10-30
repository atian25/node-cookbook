'use strict';

const fs = require('fs');
const path = require('path');

const Micro = require('./lib/micro');
const app = new Micro();

// 简化示例，直接全局变量存储数据。
const projectList = [
  { name: 'Express', description: 'this is detail of Express', star: false },
  { name: 'Koa', description: 'this is detail of Koa', star: true },
  { name: 'Egg', description: 'this is detail of Egg', star: true },
];

// 打印访问日志
app.use((req, res, next) => {
  console.log(`visit: ${req.method} ${req.url}`);
  next(); // 继续执行后续逻辑
});

// 路由映射
app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
  const html = fs.readFileSync(path.join(__dirname, 'view/index.html'));
  return res.end(html);
});

app.get('/api/project', (req, res) => {
  const data = {
    list: projectList,
  };
  res.json(data);
});

// 解析 Body，存到 `req.body` 供后续中间件使用
app.use((req, res, next) => {
  if (req.method !== 'POST') return next();

  const body = [];

  req.on('data', chunk => {
    body.push(chunk);
  });

  req.on('end', () => {
    // 解析 Body，存到 `req.body` 供后续中间件使用
    req.body = JSON.parse(Buffer.concat(body).toString());
    next();
  });
});

app.post('/api/project/toggle', (req, res) => {
  // 上一个中间件的产物
  const { name, star } = req.body;

  // 查询找到 project 对象，并更新状态
  const data = projectList.find(x => x.name === name);
  data.star = star;

  // 发送响应
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
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
