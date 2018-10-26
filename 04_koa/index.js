'use strict';

const path = require('path');
const Koa = require('koa');
const staticCache = require('koa-static-cache');
const Router = require('koa-router');

// 引入处理逻辑
const home = require('./app/home');
const notFound = require('./app/not_found');
const projects = require('./app/projects');

// 根据 URL 返回不同的内容
const app = new Koa();
const router = new Router();

// 兜底处理
app.use(notFound);

// 路由映射
router.get('/', home);
router.get('/api/projects', projects.list);
router.get('/api/projects/detail', projects.detail);

// 静态资源
app.use(staticCache({
  prefix: '/public',
  dir: path.join(__dirname, 'app/public'),
  dynamic: true,
  preload: false,
}));

// 打印访问日志
app.use((ctx, next) => {
  console.log(`visit ${ctx.url}`);
  return next(); // 继续执行后续逻辑
});

// 挂载路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
