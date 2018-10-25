'use strict';

const http = require('http');
const URL = require('url');

module.exports = class Cell {
  constructor() {
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push({ fn });
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
    if (method && method !== req.method) return false;
    if (!pattern) return true;

    const urlObj = URL.parse(req.url, true);

    if (typeof pattern === 'string') {
      return urlObj.pathname === pattern;
    } else if (pattern instanceof RegExp) {
      return pattern.test(urlObj.pathname);
    }
  }

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

  listen(port, callback) {
    this.server = http.createServer(this.handler.bind(this));
    this.server.listen(port, callback);
  }
};
