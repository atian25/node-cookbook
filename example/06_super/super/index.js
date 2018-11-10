'use strict';

const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');

module.exports = class Super extends Koa {
  constructor(opts) {
    super();

    // 应用目录
    this.baseDir = opts.baseDir;
    this.frameworkDir = __dirname;

    // 加载单元，默认为：框架 -> 应用
    this.loadUnits = [ this.frameworkDir, this.baseDir ];

    // 按照目录规范自动挂载
    this.load();
  }

  load() {
    this.loadConfig();
    this.loadModel();
    this.loadMiddleware();
    this.loadController();
    this.loadRouter();
  }

  // 加载框架和应用的 `config/config.js` 配置文件，并合并，挂载到 `app.config` 上。
  loadConfig() {
    this.config = {};

    // 加载所有 loadUnits 的文件
    for (const unit of this.loadUnits) {
      const mod = require(path.join(unit, 'config/config.js'));
      const config = mod({ baseDir: this.baseDir });
      // 合并配置
      Object.assign(this.config, config);
    }
  }

  // 加载应用的 `app/model` 目录，挂载到 Context 原型上，可以通过 `ctx.model` 调用
  loadModel() {
    // 扩展 Context 原型
    this.context.model = {};

    const dir = path.join(this.baseDir, 'app/model');
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const baseName = path.basename(file, '.js');
      const Model = require(path.join(dir, file));

      // 每次请求都会初始化一个
      const INSTANCE = Symbol(`context#cache_${baseName}`);
      Object.defineProperty(this.context.model, baseName, {
        get() {
          // 当前请求内，调用多次都仅初始化一次。
          if (!this[INSTANCE]) {
            this[INSTANCE] = new Model(this);
          }
          return this[INSTANCE];
        },
      });
    }
  }

  // 加载中间件
  loadMiddleware() {
    const cfg = this.config;
    const middlewareMap = {};

    // 加载所有 loadUnits 的文件
    for (const unit of this.loadUnits) {
      const dir = path.join(unit, 'app/middleware');
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const baseName = path.basename(file, '.js');
        const mod = require(path.join(dir, file));
        // 实例化 Middleware，传递同名的 Config
        const opts = cfg[baseName] || {};
        middlewareMap[baseName] = mod(opts, this);
      }
    }

    // 按顺序挂载 middlewares
    const middlewareList = [ ...cfg.coreMiddleware, ...cfg.middleware ];
    for (const name of middlewareList) {
      this.use(middlewareMap[name]);
    }
  }

  // 加载 Controller 并挂载到 `app.controller` 上，仅加载 `应用` 的 `app/controller` 目录。
  loadController() {
    this.controller = {};

    const dir = path.join(this.baseDir, 'app/controller');
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const baseName = path.basename(file, '.js');
      this.controller[baseName] = require(path.join(dir, file));
    }
  }

  // 加载应用的 `app/router.js` 文件，映射路由
  loadRouter() {
    this.router = new Router();

    // 提供 RESTful API 语法糖
    this.router.resources = (prefix, controller) => {
      const { index, create, update, destroy } = controller;
      if (index) this.router.get(prefix, index);
      if (create) this.router.post(prefix, create);
      if (update) this.router.put(`${prefix}/:id(\\d+)`, update);
      if (destroy) this.router.delete(`${prefix}/:id(\\d+)`, destroy);
      return this.router;
    };

    // 加载应用的路由映射文件
    const mod = require(path.join(this.baseDir, 'app/router.js'));
    mod(this);

    // 确保是最后一个中间件
    this.use(this.router.routes());
  }
};
