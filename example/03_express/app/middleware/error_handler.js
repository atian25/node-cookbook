'use strict';

/* eslint no-unused-vars: 0 */
// 必须是 4 个参数
module.exports = function(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.url} got ${err.message}`);
  res.status(500);
  res.statusMessage = err.message;
  res.end();
};
