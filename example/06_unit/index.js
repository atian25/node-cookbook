'use strict';

const Unit = require('./lib/unit');

const app = new Unit({
  baseDir: __dirname,
});

// 直接执行的时候，启动服务
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
  });
}

module.exports = app.callback();
