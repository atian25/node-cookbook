'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home);
  router.get('/api/todo', controller.todo.list);
  router.post('/api/todo', controller.todo.add);
  router.put('/api/todo', controller.todo.update);
  router.delete('/api/todo/:id(\\d+)', controller.todo.remove);
};
