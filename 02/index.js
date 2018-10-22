// index.js
const http = require('http');

// 引入处理逻辑
const home = require('./app/home');
const notFound = require('./app/not_found');
const project = require('./app/api/project');

const server = http.createServer((req, res) => {
  // 根据 URL 返回不同的内容
  switch (req.url) {
    case '/': {
      return home(req, res);
    }

    case '/api/projects': {
      return project(req, res);
    }

    default: {
      return notFound(req, res);
    }
  }
});

server.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
