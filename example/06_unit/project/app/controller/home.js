'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

// 把 fs 转为 Promise
const readFile = util.promisify(fs.readFile);

module.exports = async ctx => {
  // 注意：此处为简化示例，一般需要缓存
  const html = await readFile(path.join(__dirname, '../view/index.html'));
  ctx.set('Content-Type', 'text/html');
  ctx.body = html;
};
