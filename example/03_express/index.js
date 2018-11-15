'use strict';

const express = require('express');
const path = require('path');

// 引入第三方插件
const bodyParser = require('body-parser');

// 引入处理逻辑
const notFound = require('./app/middleware/not_found');
const errorHandler = require('./app/middleware/error_handler');
const accessLog = require('./app/middleware/access_log');
const cors = require('./app/middleware/cors');

// 引入 Controller
const home = require('./app/controller/home');
const todo = require('./app/controller/todo');

// 实例化应用
const app = new express();

// 挂载中间件
app.use('/public', express.static(path.join(__dirname, 'app/public')));
app.use(bodyParser.json());
app.use(accessLog()); // 记录访问耗时，并打印日志
app.use('/api', cors({ origin: '*' })); // 对 API 接口输出跨域头

// 路由映射
app.get('/', home);
app.get('/api/todo', todo.index);
app.post('/api/todo', todo.create);
app.put('/api/todo/:id', todo.update);
app.delete('/api/todo/:id', todo.destroy);

// 挂载后置中间件
app.use(notFound());
app.use(errorHandler());

// 直接执行的时候，启动服务
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
  });
}

module.exports = app;
