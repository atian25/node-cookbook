'use strict';

const http = require('http');

// 引入处理逻辑
const home = require('./app/home');
const notFound = require('./app/not_found');
const projects = require('./app/api/projects');

// 根据 URL 返回不同的内容
function handler(req, res) {
  switch (req.url) {
    case '/': {
      return home(req, res);
    }

    case '/api/projects': {
      return projects.list(req, res);
    }

    default: {
      return notFound(req, res);
    }
  }
}

// 启动服务
const server = http.createServer(handler);
server.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
