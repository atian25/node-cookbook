'use strict';

const express = require('express');

// 引入处理逻辑
const home = require('./app/home');
const notFound = require('./app/not_found');
const projects = require('./app/api/projects');

const app = new express();

// 打印访问日志
app.use((req, res, next) => {
  console.log(`visit ${req.url}`);
  next(); // 继续执行后续逻辑
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
