'use strict';

const fs = require('fs');
const path = require('path');

const Micro = require('./lib/micro');
const app = new Micro();

// 简化示例，直接全局变量存储数据。
const todoList = [
  { id: '1', title: 'Forgot Express', completed: true },
  { id: '2', title: 'Learn Koa', completed: true },
  { id: '3', title: 'Learn Egg', completed: false },
];

// 打印访问日志
app.use((req, res, next) => {
  console.log(`visit: ${req.method} ${req.url}`);
  next(); // 继续执行后续逻辑
});

// 路由映射
app.get('/', (req, res) => {
  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
  const html = fs.readFileSync(path.join(__dirname, 'view/index.html'));
  return res.end(html);
});

// 查询列表，支持过滤 `/api/todo?completed=true`
app.get('/api/todo', (req, res) => {
  const { query } = req;
  let data = todoList;

  // 查询列表，从而过滤参数
  if (query.completed !== undefined) {
    // query 参数均为字符串，需转换
    query.completed = query.completed === 'true';
    data = todoList.filter(x => x.completed === query.completed);
  }

  // 发送响应
  res.status(200);
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

// 创建任务
app.post('/api/todo', (req, res) => {
  // 上一个中间件的产物
  const todo = req.body;

  // 补全数据，保存
  todo.id = Date.now().toString();
  todo.completed = false;
  todoList.push(todo);

  // 发送响应
  res.status(201);
  res.json(todo);
});

// 修改任务
app.put('/api/todo', (req, res) => {
  // 上一个中间件的产物
  let todo = req.body;
  const { id } = todo;

  // 查找对应 ID 的任务对象
  const index = id ? todoList.findIndex(x => x.id === id) : -1;

  // 未找到
  if (index === -1) {
    res.status(404);
    res.statusMessage = `task#${id} not found`;
    return res.end();
  }

  // 修改 todo 对象，并更新状态
  todo = Object.assign(todoList[index], todo);

  // 发送响应
  res.status(204);
  return res.end();
});

// 删除任务
app.delete(/^\/api\/todo\/(\d+)$/, (req, res) => {
  // 框架从 URL 中用正则式匹配出 ID，存到了 `req.params` 中
  const id = req.params[0];

  // 查找对应 ID 的任务对象
  const index = id ? todoList.findIndex(x => x.id === id) : -1;

  // 未找到
  if (index === -1) {
    res.status(404);
    res.statusMessage = `task#${id} not found`;
    return res.end();
  }

  // 删除对象
  todoList.splice(index, 1);
  res.status(204);
  return res.end();
});

// 兜底处理
app.use((req, res) => {
  res.status(404);
  res.end(`${req.method} ${req.url} not found`);
});

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
