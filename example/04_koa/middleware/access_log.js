'use strict';

module.exports = (ctx, next) => {
  // 打印访问日志
  console.log(`visit ${ctx.method} ${ctx.url}`);
  return next(); // 继续执行后续逻辑
};
