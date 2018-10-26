'use strict';

const express = require('express');
const path = require('path');

// 引入第三方插件
const cookieParser = require('cookie-parser');

// 引入处理逻辑
const home = require('./app/home');
const notFound = require('./app/not_found');
const projects = require('./app/projects');

// 实例化应用
const app = new express();

// 挂载中间件
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'app/public')));

// 打印访问日志
app.use((req, res, next) => {
  console.log(`visit ${req.url}`);
  next(); // 继续执行后续逻辑
});

// 支持简化的表达式
app.use('/api/*', (req, res, next) => {
  setTimeout(next, 300); // 延迟返回，用于测试
});

// 路由映射
app.get('/', home);
app.get('/api/projects', projects.list);
app.get('/api/projects/detail', projects.detail);
app.use(notFound);

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
