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

  // 处理函数
  handler(req, res) {
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
