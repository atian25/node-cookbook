'use strict';

const http = require('http');
const URL = require('url');

function handler(req, res) {
  // log: `POST`
  console.log('> method:', req.method);

  // log: { 'user-agent': 'node_http', 'content-type': 'application/json' }
  console.log('> headers:', req.headers);

  // log: `/api/star?id=12345`
  console.log('> url:', req.url);

  const urlObj = URL.parse(req.url, true);

  // log: `/api/star`
  console.log('> path:', urlObj.pathname);

  // log: { id: '12345' }
  console.log('> query:', urlObj.query);

  // receive body
  let body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    // log: { key: 'Node.js' }
    console.log('> body:', JSON.parse(body));

    // send response
    const data = { key: 'Node.js', desc: 'a JavaScript runtime built on V8' };
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  });
}

const server = http.createServer(handler);
server.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
