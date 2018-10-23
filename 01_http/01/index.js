'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'public/index.html'));

const server = http.createServer((req, res) => {
  // 根据 URL 返回不同的内容
  switch (req.url) {
    case '/': {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      return res.end(html);
    }

    case '/api/projects': {
      const data = { list: [ 'Node', 'Koa', 'Egg' ] };
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(data, null, 2));
    }

    default: {
      res.statusCode = 404;
      res.end(`${req.url} not found`);
    }
  }
});

server.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
