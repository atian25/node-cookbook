'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(req, res, next) {
  res.status(200);
  res.type('html');
  // 注意：此处为简化示例，一般需要缓存
  const filePath = path.join(__dirname, '../view/index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) return next(err);
    res.end(content);
  });
};

