'use strict';

const path = require('path');
const Koa = require('koa');
const staticCache = require('koa-static-cache');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

// 引入处理逻辑
const home = require('./controller/home');
const notFound = require('./controller/not_found');
const todo = require('./controller/todo');

// 根据 URL 返回不同的内容
const app = new Koa();
const router = new Router();

// 静态资源
app.use(staticCache({
  prefix: '/public',
  dir: path.join(__dirname, 'public'),
  dynamic: true,
  preload: false,
}));

// Body 解析
app.use(bodyParser());

// 打印访问日志
app.use((ctx, next) => {
  console.log(`visit ${ctx.url}`);
  return next(); // 继续执行后续逻辑
});

// 兜底处理
app.use(notFound);

// 路由映射
router.get('/', home);
router.get('/api/list', todo.list);
router.post('/api/update', todo.update);
router.delete('/api/remove', todo.remove);

// 挂载路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
