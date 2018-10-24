'use strict';

const http = require('http');
const URL = require('url');

module.exports = class Framework {
  constructor() {
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push({
      fn,
    });
  }

  get(pattern, fn) {
    this.middlewares.push({
      method: 'GET',
      pattern,
      fn,
    });
  }

  _match(req, rule) {
    const { pattern, method } = rule;
    if (method !== req.method) return false;
    if (pattern instanceof RegExp) {
      return pattern.test();
    } else if (typeof pattern === 'string') {
      return URL.parse(req.url, true).pathname === pattern;
    }
  }

  handler(req, res) {
    console.log(`process ${req.url}`);
    for (const rule of this.middlewares) {
      if (this._match(req, rule)) {
        return rule.fn(req, res);
      }
    }
    // not found
    res.statusCode = 404;
    res.end(`${req.url} not found`);
  }

  handler2(req, res) {
    let i = 0;
    const next = () => {
      const { pattern, fn } = this.middlewares[i++];
      if (!fn) return;
      if (pattern && !pattern.test(req.url)) return next();
      fn(req, res, next);
    };
    next();
  }

  listen(port, callback) {
    this.server = http.createServer(this.handler.bind(this));
    this.server.listen(port, callback);
  }
};
