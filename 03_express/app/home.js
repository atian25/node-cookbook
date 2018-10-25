'use strict';

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'));

module.exports = function(req, res) {
  res.status(200);
  res.type('html');
  res.end(html);
};
