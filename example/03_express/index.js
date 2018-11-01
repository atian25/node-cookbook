'use strict';

const express = require('express');
const path = require('path');

// 引入第三方插件
const bodyParser = require('body-parser');

// 引入处理逻辑
const accessLog = require('./middleware/access_log');
const notFound = require('./middleware/not_found');
const home = require('./middleware/home');
const todo = require('./middleware/todo');

// 实例化应用
const app = new express();

// 挂载中间件
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(accessLog);

// 路由映射
app.get('/', home);
app.get('/api/todo', todo.list);
app.post('/api/todo', todo.add);
app.put('/api/todo', todo.update);
app.delete('/api/todo/:id(\\d+)', todo.remove);

// 挂载后置中间件
app.use(notFound);

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
