'use strict';

const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');

// 简化示例，直接全局变量存储数据。
const todoList = [
  { id: 1, title: 'Forgot Express', completed: true },
  { id: 2, title: 'Learn Koa', completed: true },
  { id: 3, title: 'Learn Egg', completed: false },
];

// 业务逻辑处理
function handler(req, res) {
  const { pathname, query } = URL.parse(req.url, true);

  // 打印访问日志
  console.log(`visit: ${req.method} ${req.url}`);

  // 根据 URL 返回不同的内容
  if (pathname === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
    const html = fs.readFileSync(path.join(__dirname, 'view/index.html'));
    res.end(html);
    return;
  }

  // 查询列表，支持过滤
  if (pathname === '/api/list') {
    let data = todoList;

    // 查询列表，支持过滤参数 `/api/list?completed=true`
    if (query.completed !== undefined) {
      query.completed = query.completed === 'true';
      data = todoList.filter(x => x.completed === query.completed);
    }

    // 发送响应
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return;
  }

  // POST 请求，判断 `method`
  if (req.method === 'POST' && pathname === '/api/update') {
    // 需监听事件接收 POST Body
    const body = [];

    req.on('data', chunk => {
      body.push(chunk);
    });

    req.on('end', () => {
      // 解析 Body， { id, title, completed }
      let todo = JSON.parse(Buffer.concat(body).toString());

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
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(todo));
    });
    // 别忘了跳过后续路由
    return;
  }

  // DELETE 请求
  if (req.method === 'DELETE' && pathname === '/api/remove') {
    const id = Number(query.id);
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
