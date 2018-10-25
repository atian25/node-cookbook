'use strict';

const http = require('http');
const URL = require('url');

module.exports = class Cell {
  constructor() {
    this.middlewares = [];
  }

  // 挂载中间件
  use(fn) {
    this.middlewares.push({ fn });
  }

  // 挂载路由
  get(pattern, fn) {
    this.middlewares.push({
      method: 'GET',
      pattern,
      fn,
    });
  }

  // 路由匹配
  _match(req, rule) {
    const { pattern, method } = rule;
    if (method && method !== req.method) return false;
    if (!pattern) return true;

    const urlObj = URL.parse(req.url, true);

    if (typeof pattern === 'string') {
      return urlObj.pathname === pattern;
    } else if (pattern instanceof RegExp) {
      return pattern.test(urlObj.pathname);
    }
  }

  // 注意：此处为简化示例，一般需要包裹一层，此处直接写入，仅供参考
  _patch(req, res) {
    // req
    const urlObj = URL.parse(req.url, true);
    req.pathname = urlObj.pathname;
    req.query = urlObj.query;

    // res
    res.json = data => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data, null, 2));
    };
  }

  // 处理函数
  handler(req, res) {
    // 扩展 API 语法糖
    this._patch(req, res);

    let i = 0;
    const next = () => {
      const rule = this.middlewares[i++];
      if (!rule) return;
      if (!this._match(req, rule)) return next();
      rule.fn(req, res, next);
    };
    next();
  }

  // 启动服务
  listen(port, callback) {
    this.server = http.createServer(this.handler.bind(this));
    this.server.listen(port, callback);
  }
};
