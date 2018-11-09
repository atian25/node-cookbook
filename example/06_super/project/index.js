'use strict';

const Super = require('super');

const app = new Super({
  baseDir: __dirname,
});

// 直接执行的时候，启动服务
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
  });
}

module.exports = app.callback();
