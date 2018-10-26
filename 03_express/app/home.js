'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(req, res) {
  res.statusCode = 200;
  res.type('html');
  // 注意：此处为简化示例，一般需要缓存，且一定不能使用 Sync 同步方法
  const html = fs.readFileSync(path.join(__dirname, 'view/index.html'));
  return res.end(html);
};

