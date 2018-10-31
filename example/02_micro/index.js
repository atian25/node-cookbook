'use strict';

const fs = require('fs');
const path = require('path');

const Micro = require('./lib/micro');
const app = new Micro();

// 简化示例，直接全局变量存储数据。
const todoList = [
  { id: 1, title: 'Forgot Express', completed: true },
  { id: 2, title: 'Learn Koa', completed: true },
  { id: 3, title: 'Learn Egg', completed: false },
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

// 查询列表，支持过滤
app.get('/api/list', (req, res) => {
  const { query } = req;
  let data = todoList;

  // 查询列表，支持过滤参数 `/api/list?completed=true`
  if (query.completed !== undefined) {
    query.completed = query.completed === 'true';
    data = todoList.filter(x => x.completed === query.completed);
  }

  // 发送响应
  return res.json(data);
});

// 解析 Body，存到 `req.body` 供后续中间件使用
app.use((req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PUT') return next();

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

// 更新操作
app.post('/api/update', (req, res) => {
  // 上一个中间件的产物
  let todo = req.body;

  if (!todo.id) {
    // 无 ID 则新增
    todo.id = Date.now();
    todo.completed = false;
    todoList.push(todo);
  } else {
    // 修改，查找 todo 对象，并更新状态
    const data = todoList.find(x => x.id === todo.id);
    todo = Object.assign(data, todo);
  }

  // 发送响应
  return res.json(todo);
});

// 删除操作
app.delete('/api/remove', (req, res) => {
  const id = Number(req.query.id);
  const index = todoList.findIndex(x => x.id === id);
  // not found
  if (index === -1) {
    res.statusCode = 404;
    res.statusMessage = `task#${id} not found`;
    return res.end();
  }
  // deleted
  todoList.splice(index, 1);
  res.statusCode = 204;
  return res.end();
});

// 兜底处理
app.use((req, res) => {
  res.statusCode = 404;
  res.end(`${req.method} ${req.url} not found`);
});

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
