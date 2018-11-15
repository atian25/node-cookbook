'use strict';

const responseTime = require('response-time');

module.exports = () => {
  return responseTime((req, res, time) => {
    // 记录访问耗时，并打印日志
    const cost = time.toFixed(0);
    res.set('X-Response-Time', `${cost}ms`); // 返回到 Header
    console.log(`[Visit] ${req.method} ${req.url} ${res.statusCode} (${cost}ms)`); // 打印日志
  });
};
