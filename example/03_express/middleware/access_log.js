'use strict';

module.exports = function(req, res, next) {
  // 打印访问日志
  console.log(`visit ${req.method} ${req.url}`);
  next(); // 继续执行后续逻辑
};
