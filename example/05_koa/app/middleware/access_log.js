'use strict';

module.exports = async (ctx, next) => {
  // 记录访问耗时，并打印日志
  const start = Date.now();

  await next(); // 继续执行后续逻辑

  const cost = Date.now() - start;
  ctx.set('X-Response-Time', `${cost}ms`); // 返回到 Header
  console.log(`[Visit] ${ctx.method} ${ctx.url} ${ctx.status} (${cost}ms)`); // 打印日志
};
