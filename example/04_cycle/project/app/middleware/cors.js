'use strict';

module.exports = options => {
  const origin = options.origin || '*';

  return async (ctx, next) => {
    await next();
    ctx.set('Access-Control-Allow-Origin', origin);
  };
};
