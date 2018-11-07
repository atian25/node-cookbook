'use strict';

const path = require('path');
const Cycle = require('./lib/cycle');

// 引入处理逻辑
const staticCache = require('./app/middleware/static');
const bodyParser = require('./app/middleware/body_parser');
const accessLog = require('./app/middleware/access_log');
const notFound = require('./app/middleware/not_found');
const errorHandler = require('./app/middleware/error_handler');

const home = require('./app/controller/home');
const todo = require('./app/controller/todo');

// 实例化应用
const app = new Cycle();

// 挂载中间件，无需区分前置后置

// 静态资源
app.use(staticCache({
  prefix: '/public',
  dir: path.join(__dirname, 'app/public'),
}));
app.use(errorHandler()); // 错误处理
app.use(notFound()); // 兜底处理
app.use(bodyParser()); // Body 解析
app.use(accessLog()); // 打印访问日志

// 路由映射
app.get('/', home);
app.get('/api/todo', todo.list);
app.post('/api/todo', todo.add);
app.put('/api/todo', todo.update);
app.delete(/^\/api\/todo\/(\d+)$/, todo.remove);

// 直接执行的时候，启动服务
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
  });
}

module.exports = app.handler.bind(app);
