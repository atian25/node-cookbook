'use strict';

// app/middleware/cors.js
module.exports = (options = {}) => {
  // 允许初始化配置
  const origin = options.origin || '*';

  // 返回中间件
  return (req, res, next) => {
    res.set('Access-Control-Allow-Origin', origin);
    next();
  };
};
