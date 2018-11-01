'use strict';

const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');

// 简化示例，直接全局变量存储数据。
const todoList = [
  { id: '1', title: 'Forgot Express', completed: true },
  { id: '2', title: 'Learn Koa', completed: true },
  { id: '3', title: 'Learn Egg', completed: false },
];

// 业务逻辑处理
function handler(req, res) {
  const { method, url } = req;
  const { pathname, query } = URL.parse(url, true);

  // 打印访问日志
  console.log(`visit: ${method} ${url}`);

  // 根据 URL 返回不同的内容
  if (pathname === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
    const html = fs.readFileSync(path.join(__dirname, 'view/index.html'));
    res.end(html);
    return;
  }

  // 查询列表，支持过滤 `/api/todo?completed=true`
  if (method === 'GET' && pathname === '/api/todo') {
    let data = todoList;

    // 查询列表，从而过滤参数
    if (query.completed !== undefined) {
      // query 参数均为字符串，需转换
      query.completed = query.completed === 'true';
      data = todoList.filter(x => x.completed === query.completed);
    }

    // 发送响应
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data));
  }

  // POST 请求，创建任务
  if (method === 'POST' && pathname === '/api/todo') {
    // 需监听事件接收 Body
    const body = [];

    req.on('data', chunk => {
      body.push(chunk);
    });

    req.on('end', () => {
      // 解析 Body， { id, title, completed }
      const todo = JSON.parse(Buffer.concat(body).toString());

      // 补全数据，保存
      todo.id = Date.now().toString();
      todo.completed = false;
      todoList.push(todo);

      // 发送响应
      res.statusCode = 201;
      return res.end(JSON.stringify(todo));
    });
    // 别忘了跳过后续路由
    return;
  }

  // PUT 请求，修改任务
  if (method === 'PUT' && pathname === '/api/todo') {
    const body = [];
    req.on('data', chunk => { body.push(chunk); });

    req.on('end', () => {
      // 解析 Body， { id, title, completed }
      let todo = JSON.parse(Buffer.concat(body).toString());
      const { id } = todo;

      // 查找对应 ID 的任务对象
      const index = id ? todoList.findIndex(x => x.id === id) : -1;

      // 未找到
      if (index === -1) {
        res.statusCode = 404;
        res.statusMessage = `task#${id} not found`;
        return res.end();
      }

      // 修改 todo 对象，并更新状态
      todo = Object.assign(todoList[index], todo);

      // 发送响应
      res.statusCode = 204;
      return res.end();
    });
    // 别忘了跳过后续路由
    return;
  }

  // DELETE 请求，`/api/todo/123456`
  if (method === 'DELETE' && pathname.startsWith('/api/todo/')) {
    // 从 URL 中用正则式匹配出 ID
    const match = pathname.match(/^\/api\/todo\/(\d+)$/);
    const id = match && match[1];

    // 查找对应 ID 的任务对象
    const index = id ? todoList.findIndex(x => x.id === id) : -1;

    // 未找到
    if (index === -1) {
      res.statusCode = 404;
      res.statusMessage = `task#${id} not found`;
      return res.end();
    }

    // 删除对象
    todoList.splice(index, 1);
    res.statusCode = 204;
    return res.end();
  }

  // 兜底处理
  res.statusCode = 404;
  res.end(`${req.method} ${req.url} not found`);
}

// 启动服务
const server = http.createServer(handler);
server.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
