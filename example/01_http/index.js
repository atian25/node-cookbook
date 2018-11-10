'use strict';

const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');
const Todo = require('./app/model/todo');

// 简化示例，直接全局变量存储数据。
const db = new Todo();

// 业务逻辑处理
function handler(req, res) {
  const { method, url } = req;
  const { pathname, query } = URL.parse(url, true);

  // 记录访问耗时，并打印日志
  const start = Date.now();
  const originFn = res.writeHead;
  res.writeHead = (...args) => {
    const cost = Date.now() - start;
    res.setHeader('X-Response-Time', `${cost}ms`); // 返回到 Header
    console.log(`[Visit] ${method} ${url} ${res.statusCode} (${cost}ms)`); // 打印日志
    return originFn.call(res, ...args);
  };

  // 根据 URL 返回不同的内容
  if (pathname === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    // 注意：此处为简化示例，一般需要缓存
    const filePath = path.join(__dirname, 'app/view/index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) return errorHandler(err, req, res);
      res.end(content.toString());
    });

    return; // 别忘了跳过后续路由
  }

  // 查询列表，支持过滤 `/api/todo?completed=true`
  if (method === 'GET' && pathname === '/api/todo') {
    // query 参数均为字符串，需转换
    let { completed } = query;
    if (query.completed !== undefined) completed = completed === 'true';

    db.list({ completed }, (err, data) => {
      if (err) return errorHandler(err, req, res); // 错误处理
      // 发送响应
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(data));
    });

    return; // 别忘了跳过后续路由
  }

  // POST 请求，创建任务
  if (method === 'POST' && pathname === '/api/todo') {
    // 需监听事件接收 Body
    const buffer = [];

    req.on('data', chunk => {
      buffer.push(chunk);
    });

    req.on('end', () => {
      // 解析 Body， { id, title, completed }
      const todo = JSON.parse(Buffer.concat(buffer).toString());

      db.create(todo, (err, data) => {
        if (err) return errorHandler(err, req, res); // 错误处理
        // 发送响应
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(data));
      });
    });

    return; // 别忘了跳过后续路由
  }

  // PUT 请求，修改任务 `/api/todo/12345`
  if (method === 'PUT' && pathname.startsWith('/api/todo/')) {
    // 从 URL 中用正则式匹配出 ID
    const match = pathname.match(/^\/api\/todo\/(\d+)$/);
    const id = match && match[1];

    const buffer = [];
    req.on('data', chunk => {
      buffer.push(chunk);
    });
    req.on('end', () => {
      // 解析 Body， { id, title, completed }
      const body = JSON.parse(Buffer.concat(buffer).toString());

      db.update(id, body, err => {
        if (err) return errorHandler(err, req, res); // 错误处理
        // 发送响应，无需返回对象
        res.statusCode = 204;
        res.setHeader('Content-Type', 'application/json');
        return res.end();
      });
    });

    return; // 别忘了跳过后续路由
  }

  // DELETE 请求，删除任务，`/api/todo/12345`
  if (method === 'DELETE' && pathname.startsWith('/api/todo/')) {
    const match = pathname.match(/^\/api\/todo\/(\d+)$/);
    const id = match && match[1];

    db.destroy(id, err => {
      if (err) return errorHandler(err, req, res); // 错误处理
      // 发送响应，无需返回对象
      res.statusCode = 204;
      res.setHeader('Content-Type', 'application/json');
      return res.end();
    });

    return; // 别忘了跳过后续路由
  }

  // 兜底处理
  notFoundHandler(req, res);
}

// 错误处理
function errorHandler(err, req, res) {
  console.error(`[Error] ${req.method} ${req.url} got ${err.message}`);
  res.statusCode = 500;
  res.statusMessage = err.message;
  res.end();
}

// 兜底处理
function notFoundHandler(req, res) {
  const msg = `[Error] ${req.method} ${req.url} not found`;
  console.warn(msg);
  res.statusCode = 404;
  res.end(msg);
}

// 直接执行的时候，启动服务
if (require.main === module) {
  const server = http.createServer(handler);
  server.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
  });
}

module.exports = handler;
