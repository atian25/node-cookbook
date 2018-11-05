'use strict';

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(`[Error] ${ctx.method} ${ctx.url} got ${err.message}`);
    ctx.status = 500;
  }
};
