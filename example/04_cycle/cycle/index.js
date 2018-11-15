'use strict';

const http = require('http');
const URL = require('url');
const createError = require('http-errors');
module.exports = class Cycle {
  constructor() {
    this.middlewares = [];

    // 注册语法糖，app.get() / app.post()
    for (const method of [ 'GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH' ]) {
      this[method.toLowerCase()] = (pattern, fn) => {
        this.middlewares.push({ method, pattern, fn });
        return this;
      };
    }
  }

  // 挂载中间件
  use(pattern, fn) {
    // 支持单个入参 `use(fn)` 形式
    if (fn === undefined && typeof pattern === 'function') {
      fn = pattern;
      pattern = undefined;
    }
    // 保存
    this.middlewares.push({
      pattern,
      fn,
    });
    // 返回自己，方便链式调用
    return this;
  }

  // 路由匹配
  _match(ctx, rule) {
    const { pattern, method } = rule;
    if (method && method !== ctx.method) return false;
    if (!pattern) return true;

    const { pathname } = ctx;

    if (typeof pattern === 'string') {
      return pathname === pattern;
    } else if (pattern instanceof RegExp) {
      // 正则式表达式
      const match = pathname.match(pattern);
      if (!match) return false;

      // 把匹配的分组结果存入 `req.params`
      ctx.params = match.slice(1);
      return true;
    }
  }

  // 把 reqest/response 封装为 context 上下文
  _patch(req, res) {
    const { url, method, headers } = req;
    const { pathname, query } = URL.parse(url, true);

    const ctx = {
      // 原始对象
      req,
      res,

      // 代理请求对象
      url,
      method,
      headers,
      pathname,
      query,

      // 代理响应对象
      set(key, value) {
        this.res.setHeader(key, value);
        return this;
      },

      get(key) {
        return this.res.getHeader(key);
      },

      set status(code) {
        this.res.statusCode = code;
        return this;
      },

      get status() {
        return this.res.statusCode;
      },

      message(msg) {
        this.res.statusMessage = msg;
        return this;
      },

      // 对响应 Body 多一层代理封装
      _body: undefined,

      get body() {
        return this._body;
      },

      set body(value) {
        this._body = value;
      },

      // 错误处理 ctx.throw(400, 'name required') / ctx.throw(new Error('invalid'))
      // https://github.com/jshttp/http-errors
      throw(...args) {
        throw createError(...args);
      },
    };

    return ctx;
  }

  // 处理函数
  handler(req, res) {
    // 上下文
    const ctx = this._patch(req, res);

    // 组合中间件
    let i = 0;
    const next = () => {
      const rule = this.middlewares[i++];
      if (!rule) return Promise.resolve();
      if (!this._match(ctx, rule)) return next();
      try {
        return Promise.resolve(rule.fn(ctx, next));
      } catch (err) {
        return Promise.reject(err);
      }
    };

    // 执行
    next().then(() => {
      // 最终写入 Header 和 Body
      if (typeof ctx.body === 'string') {
        res.end(ctx.body);
      } else if (Buffer.isBuffer(ctx.body)) {
        res.end(ctx.body.toString());
      } else {
        ctx.set('Content-Type', 'application/json');
        res.end(JSON.stringify(ctx.body));
      }
    }).catch(err => {
      console.log(err);
      ctx.status = 500;
      ctx.message = err.message;
    });
  }

  // 启动服务
  listen(port, callback) {
    this.server = http.createServer(this.handler.bind(this));
    this.server.listen(port, callback);
  }
};
