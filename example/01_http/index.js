'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url');

// 简化示例，直接全局变量存储数据。
const frameworkList = [
  { name: 'Express', description: 'this is detail of Express', star: false },
  { name: 'Koa', description: 'this is detail of Koa', star: true },
  { name: 'Egg', description: 'this is detail of Egg', star: true },
];

// 业务逻辑处理
function handler(req, res) {
  const urlObj = URL.parse(req.url, true);
  const pathName = urlObj.pathname;

  // 打印访问日志
  console.log(`request api: ${req.method} ${req.url}`);

  // 根据 URL 返回不同的内容
  if (pathName === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
    const html = fs.readFileSync(path.join(__dirname, 'view/index.html'));
    res.end(html);
    return;
  }

  if (pathName === '/api/framework') {
    const data = {
      list: frameworkList,
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return;
  }

  // POST 请求，入参为 { name, star }
  if (req.method === 'POST' && pathName === '/api/framework/toggle') {
    // 需监听事件接收 POST Body
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });
    req.on('end', () => {
      // 解析 Body
      const { name, star } = JSON.parse(Buffer.concat(body).toString());

      // 查询找到 framework 对象，并更新状态
      const data = frameworkList.find(x => x.name === name);
      data.star = star;

      // 发送响应
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(data));
    });
    // 别忘了跳过后续路由
    return;
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
