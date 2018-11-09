'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home);
  router.resources('/api/todo', controller.todo);
};
