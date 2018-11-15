'use strict';

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.error(`[Error] ${ctx.method} ${ctx.url}`, err);

      ctx.status = err.status || 500;
      ctx.message = err.message;

      // API 请求错误则返回 JSON
      if (ctx.url.startsWith('/api/')) {
        ctx.body = { message: err.message };
      } else {
        ctx.type = 'html';
        ctx.body = err.message;
      }
    }
  };
};
