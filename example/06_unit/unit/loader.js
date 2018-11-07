'use strict';

const path = require('path');
const fs = require('fs');
const Router = require('koa-router');

module.exports = class Loader {
  constructor(app) {
    this.app = app;
    // 加载单元，默认为：框架 -> 应用
    this.loadUnits = [ this.app.frameworkDir, this.app.baseDir ];
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
    this.app.config = {};

    // load config
    for (const unit of this.loadUnits) {
      const mod = require(path.join(unit, 'config/config.js'));
      const cfg = mod({ baseDir: this.app.baseDir });
      // merge
      Object.assign(this.config, cfg);
    }
  }

  // 加载应用的 `app/model` 目录，挂载到 Context 原型上，可以通过 `ctx.model` 调用
  loadModel() {
    // 扩展 Context 原型
    this.app.context.model = {};

    const dir = path.join(this.baseDir, 'app/model');
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const baseName = path.basename(file, '.js');
      const Model = require(path.join(dir, file));
      this.app.context.model[baseName] = new Model();
    }
  }

  // 加载中间件
  //   - 加载框架和应用 `app/middleware` 目录里面的所有中间件
  //   - 以文件名为 key，传递对应的配置文件值，作为初始化的参数
  //   - 最后读取 `coreMiddleware` 和 `appMiddleware` 配置，按顺序挂载中间件
  loadMiddleware() {
    // load middlewares
    const middlewareMapping = {};
    for (const unit of this.loadUnits) {
      const dir = path.join(unit, 'app/middleware');
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const baseName = path.basename(file, '.js');
        const mod = require(path.join(dir, file));
        const opts = this.app.config[baseName] || {};
        middlewareMapping[baseName] = mod(opts, this);
      }
    }
    // mount middlewares
    const middlewareList = [].concat(this.app.config.coreMiddleware, this.app.config.appMiddleware);
    for (const name of middlewareList) {
      this.app.use(middlewareMapping[name]);
    }
  }

  // 加载 Controller 并挂载到 `app.controller` 上，仅加载 `应用` 的 `app/controller` 目录。
  loadController() {
    this.controller = {};

    const dir = path.join(this.app.baseDir, 'app/controller');
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const baseName = path.basename(file, '.js');
      this.app.controller[baseName] = require(path.join(dir, file));
    }
  }

  // 加载应用的 `app/router.js` 文件，映射路由
  loadRouter() {
    const router = this.app.router = new Router();

    // RESTful API
    router.resources = (prefix, controller) => {
      const { list, add, update, remove } = controller;
      if (list) router.get(prefix, list);
      if (add) router.post(prefix, add);
      if (update) router.put(prefix, update);
      if (remove) router.delete(`${prefix}/:id(\\d+)`, remove);
      return router;
    };

    // load router file
    const mod = require(path.join(this.app.baseDir, 'app/router.js'));
    // mount router
    mod(this);
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
  }
};