'use strict';

// 异常处理类型中间件
module.exports = () => {
  // 最前面多一个 err 入参，必须 4 个。
  return (err, req, res, next) => {
    if (res.headersSent) return next(err);

    console.error(`[Error] ${req.method} ${req.url}`, err);

    res.status(err.status || 500);
    res.statusMessage = err.message;

    // API 请求错误则返回 JSON
    if (req.url.startsWith('/api/')) {
      res.json({ message: err.message });
    } else {
      res.type('html');
      res.end(err.message);
    }
  };
};

