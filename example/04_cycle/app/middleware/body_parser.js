'use strict';

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.method !== 'POST' && ctx.method !== 'PUT') return next();

    ctx.requestBody = await parseBody(ctx);
    return next();
  };
};

function parseBody(ctx) {
  return new Promise(resolve => {
    const buffer = [];

    ctx.req.on('data', chunk => {
      buffer.push(chunk);
    });

    ctx.req.on('end', () => {
      // 解析 Body，供后续中间件使用
      const body = Buffer.concat(buffer).toString();
      resolve(JSON.parse(body));
    });
  });
}
