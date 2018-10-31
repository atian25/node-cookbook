'use strict';

const http = require('http');

const options = {
  method: 'POST',
  hostname: 'localhost',
  port: 3000,
  path: '/api/update?id=12345',
  headers: {
    'User-Agent': 'node_http',
    'Content-Type': 'application/json',
  },
};

// 结果处理
function handler(res) {
  // log: /api/update?id=12345
  console.log('> request path:', res.req.path);

  // log: 200
  console.log('> response code:', res.statusCode);

  // log: { 'content-type': 'application/json' }
  console.log('> response headers:', res.headers);

  // receive body
  const rawData = [];
  res.on('data', chunk => {
    rawData.push(chunk);
  });
  res.on('end', () => {
    // log: { id: '12345', title: 'Learn Node.js' }
    const data = JSON.parse(rawData);
    console.log('> response body:', data);
  });
}

// 发起请求
const req = http.request(options, handler);
req.on('error', err => { console.error('> http error:', err); });
req.write(JSON.stringify({ title: 'Learn Node.js' }));
req.end();
