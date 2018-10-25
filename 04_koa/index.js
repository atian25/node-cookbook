'use strict';

const Koa = require('koa');
const Router = require('koa-router');

// 引入处理逻辑
const home = require('./app/home');
const notFound = require('./app/not_found');
const projects = require('./app/api/projects');

// 根据 URL 返回不同的内容
const app = new Koa();
const router = new Router();

router.get('/', home);
router.get('/api/projects', projects.list);

app.use(notFound);
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
