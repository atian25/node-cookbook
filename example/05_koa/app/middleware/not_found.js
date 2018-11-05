'use strict';

module.exports = async (ctx, next) => {
  await next();

  if (ctx.status === 400) {
    const msg = `[Error] ${ctx.method} ${ctx.url} not found`;
    console.warn(msg);
    ctx.body = msg;
  }
};
