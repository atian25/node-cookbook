'use strict';

const fs = require('fs');
const path = require('path');

const Tiny = require('tiny');
const app = new Tiny();

// 简化示例，直接全局变量存储数据。
const Todo = require('./app/model/todo');
const db = new Todo();

// 记录访问耗时，并打印日志
app.use((req, res, next) => {
  const start = Date.now();
  const originFn = res.writeHead;
  res.writeHead = (...args) => {
    const cost = Date.now() - start;
    res.setHeader('X-Response-Time', `${cost}ms`); // 返回到 Header
    console.log(`[Visit] ${req.method} ${req.url} ${res.statusCode} (${cost}ms)`); // 打印日志
    return originFn.call(res, ...args);
  };
  next(); // 继续执行后续逻辑
});

// 路由映射
app.get('/', (req, res) => {
  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  // 注意：此处为简化示例，一般需要缓存
  const filePath = path.join(__dirname, 'app/view/index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) return errorHandler(err, req, res);
    res.end(content.toString());
  });
});

// 查询列表，支持过滤 `/api/todo?completed=true`
app.get('/api/todo', (req, res) => {
  // query 参数均为字符串，需转换
  let { completed } = req.query;
  if (req.query.completed !== undefined) completed = completed === 'true';

  db.list({ completed }, (err, data) => {
    if (err) return errorHandler(err, req, res); // 错误处理
    // 发送响应
    res.status(200);
    res.json(data);
  });
});

// 解析 Body，存到 `req.body` 供后续中间件使用
app.use((req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PUT') return next();

  const buffer = [];

  req.on('data', chunk => {
    buffer.push(chunk);
  });

  req.on('end', () => {
    // 解析 Body，存到 `req.body` 供后续中间件使用
    req.body = JSON.parse(Buffer.concat(buffer).toString());
    next();
  });
});

// 创建任务
app.post('/api/todo', (req, res) => {
  // `req.body` 为上一个中间件的产物
  db.create(req.body, (err, data) => {
    if (err) return errorHandler(err, req, res); // 错误处理
    // 发送响应
    res.status(201);
    res.json(data);
  });
});

// 修改任务
app.put(/^\/api\/todo\/(\d+)$/, (req, res) => {
  // 框架从 URL 中用正则式匹配出 ID，存到了 `req.params` 中
  const id = req.params[0];

  db.update(id, req.body, err => {
    if (err) return errorHandler(err, req, res); // 错误处理
    // 发送响应，无需返回对象
    res.status(204);
    res.setHeader('Content-Type', 'application/json');
    res.end();
  });
});

// 删除任务
app.delete(/^\/api\/todo\/(\d+)$/, (req, res) => {
  db.destroy(req.params[0], err => {
    if (err) return errorHandler(err, req, res); // 错误处理
    // 发送响应，无需返回对象
    res.status(204);
    res.setHeader('Content-Type', 'application/json');
    res.end();
  });
});

// 错误处理
function errorHandler(err, req, res) {
  console.error(`[Error] ${req.method} ${req.url} got ${err.message}`);
  res.status(500);
  res.statusMessage = err.message;
  res.end();
}

// 兜底处理
app.use((req, res) => {
  const msg = `[Error] ${req.method} ${req.url} not found`;
  console.warn(msg);
  res.status(404);
  res.end(msg);
});

// 直接执行的时候，启动服务
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
  });
}

module.exports = app.handler.bind(app);
