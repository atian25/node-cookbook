'use strict';

const express = require('express');
const path = require('path');

// 引入第三方插件
const bodyParser = require('body-parser');

// 引入处理逻辑
const home = require('./controller/home');
const notFound = require('./controller/not_found');
const project = require('./controller/project');

// 实例化应用
const app = new express();

// 挂载中间件
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// 打印访问日志
app.use((req, res, next) => {
  console.log(`visit ${req.url}`);
  next(); // 继续执行后续逻辑
});

// 路由映射
app.get('/', home);
app.get('/api/project', project.list);
app.post('/api/project/toggle', project.toggle);
app.use(notFound);

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
