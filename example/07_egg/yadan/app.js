'use strict';

const path = require('path');

module.exports = app => {
  // 加载中间件，注意 Key 名为文件名的驼峰格式
  app.config.coreMiddleware.push('errorHandler', 'accessLog', 'notFound');

  // 读取所有的 `app/model` 目录，挂载到 `ctx.model.todo.list()`
  const directory = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app/model'));
  app.loader.loadToContext(directory, 'model');
};
