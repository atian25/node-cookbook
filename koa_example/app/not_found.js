'use strict';

module.exports = async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    ctx.body = `${ctx.url} not found`;
  }
};
