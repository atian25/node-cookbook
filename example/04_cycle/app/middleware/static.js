'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

// 把 fs 转为 Promise
const readFile = util.promisify(fs.readFile);

// 注意：此处为简化示例，一般需要缓存，并处理目录逃逸的安全风险。
module.exports = options => {
  return async (ctx, next) => {
    if (!ctx.pathname.startsWith(options.prefix)) return next();
    const relatedPath = path.relative(options.prefix, ctx.pathname);

    // 读取静态文件，并响应
    ctx.body = await readFile(path.join(options.dir, relatedPath));
  };
};
