'use strict';

const Koa = require('koa');
const app = new Koa();

// 记录访问日志
app.use(async (ctx, next) => {
  console.log(`receive a request: ${ctx.method} ${ctx.url}`); // 1
  await next(); // 2
  console.log(`response: ${ctx.status} ${ctx.get('X-Response-Time')}`); // 7
});

// 记录请求处理耗时
app.use(async (ctx, next) => {
  const start = Date.now(); // 3
  await next(); // 4
  ctx.set('X-Response-Time', `${Date.now() - start}ms`); // 6
});

// 响应请求
app.use(async ctx => {
  ctx.body = await fetchDB(); // 5
});

// 模拟耗时的异步请求
async function fetchDB() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Hello Node');
    }, 100);
  });
}

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
