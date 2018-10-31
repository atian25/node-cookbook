'use strict';

const http = require('http');
const URL = require('url');

function handler(req, res) {
  // log: `POST`
  console.log('> method:', req.method);

  // log: { 'user-agent': 'node_http', 'content-type': 'application/json' }
  console.log('> headers:', req.headers);

  // log: `/api/update?id=12345`
  console.log('> url:', req.url);

  const urlObj = URL.parse(req.url, true);

  // log: `/api/update`
  console.log('> path:', urlObj.pathname);

  // log: { id: '12345' }
  console.log('> query:', urlObj.query);

  // receive body
  let body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    body = JSON.parse(body);
    // log: { title: 'Learn Node.js' }
    console.log('> body:', body);

    // send response
    const data = { id: urlObj.query.id, title: body.title };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  });
}

const server = http.createServer(handler);
server.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
