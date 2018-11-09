'use strict';

const Router = require('koa-router');

// 引入 Controller
const home = require('./controller/home');
const todo = require('./controller/todo');

module.exports = app => {
  // 路由映射
  const router = app.router = new Router();

  router.get('/', home);
  router.get('/api/todo', todo.list);
  router.post('/api/todo', todo.add);
  router.put('/api/todo/:id', todo.update);
  router.delete('/api/todo/:id', todo.destroy);

  // 挂载路由
  app.use(router.routes());
};
