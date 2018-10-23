// app/home.js

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'));

module.exports = function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
}