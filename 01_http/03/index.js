'use strict';

const Framework = require('./lib/framework');

const app = new Framework();

// 引入处理逻辑
const home = require('./app/home');
const notFound = require('./app/not_found');
const projects = require('./app/api/projects');

// 根据 URL 返回不同的内容
app.get('/', home);
app.get('/api/projects', projects.list);
app.get('/api/project/detail', projects.detail);
app.use(notFound);

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
