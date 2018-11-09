'use strict';

const Koa = require('koa');
const app = new Koa();

// 记录访问日志
app.use(async (ctx, next) => {
  console.log(`receive a request: ${ctx.method} ${ctx.url}`); // 1
  await next(); // 2
  console.log(`response: ${ctx.status} ${ctx.get('X-Response-Time')}`); // 10
});

// 记录请求处理耗时
app.use(async (ctx, next) => {
  const start = Date.now(); // 3
  await next(); // 4
  ctx.set('X-Response-Time', `${Date.now() - start}ms`); // 9
});

// 查询用户信息
app.use(async (ctx, next) => {
  ctx.user = await login(123456); // 5
  await next(); // 6
  // 8
});

// 响应请求
app.use(async ctx => {
  ctx.body = `Hi, ${ctx.user.name}`; // 7
});

// 模拟耗时的异步请求
async function login(id) {
  return new Promise(resolve => {
    console.log('start check user');
    setTimeout(() => {
      console.log('user login pass');
      resolve({ id, name: `User#${id}` });
    }, 100);
  });
}

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
