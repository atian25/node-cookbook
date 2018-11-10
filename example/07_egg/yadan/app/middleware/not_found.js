'use strict';

module.exports = () => {
  return async (ctx, next) => {
    await next();

    if (!ctx.status || ctx.status === 404) {
      const msg = `[Error] ${ctx.method} ${ctx.url} not found`;
      console.warn(msg);
      ctx.status = 404;
      ctx.body = msg;
    }
  };
};
