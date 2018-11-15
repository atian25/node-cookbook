'use strict';

module.exports = options => {
  return async (ctx, next) => {
    await next();
    if (ctx.url.startsWith('/api/')) {
      ctx.set('Access-Control-Allow-Origin', options.origin);
    }
  };
};
