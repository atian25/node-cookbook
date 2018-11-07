'use strict';

const Cycle = require('./');
const app = new Cycle();

// 记录访问日志
app.use(async (ctx, next) => {
  console.log(`receive a request: ${ctx.method} ${ctx.url}`); // 1
  await next(); // 2
  console.log(`response: ${ctx.status} ${ctx.get('X-Response-Time')}`); // 7
});

// 记录请求处理耗时
app.use('/api', async (ctx, next) => {
  const start = Date.now(); // 3
  await next(); // 4
  ctx.set('X-Response-Time', `${Date.now() - start}ms`); // 6
  console.log('cost', Date.now() - start);
});

app.use(async ctx => {
  console.log('logic');
  await sleep(100);
  ctx.body = 'ok ok';
});

// 模拟耗时的异步请求
async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
