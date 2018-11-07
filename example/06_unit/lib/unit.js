'use strict';

const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');

module.exports = class Unit extends Koa {

  constructor(opts) {
    super();
    this.baseDir = opts.baseDir;
    this.loadUnits = [ __dirname, this.baseDir ];
    this.load();
  }

  load() {
    this.loadConfig();
    this.loadModel();
    this.loadMiddleware();
    this.loadController();
    this.loadRouter();
  }

  loadConfig() {
    this.config = {};

    // load config
    for (const unit of this.loadUnits) {
      const mod = require(path.join(unit, 'config/config.js'));
      const cfg = mod({ baseDir: this.baseDir });
      // merge
      Object.assign(this.config, cfg);
    }
  }

  loadModel() {

  }

  loadMiddleware() {
    // load middlewares
    this.middlewareMap = {};
    for (const unit of this.loadUnits) {
      const dir = path.join(unit, 'app/middleware');
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const baseName = path.basename(file, '.js');
        const mod = require(path.join(dir, file));
        const opts = this.config[baseName] || {};
        this.middlewareMap[baseName] = mod(opts, this);
      }
    }
    // mount middlewares
    const middlewareList = [].concat(this.config.coreMiddleware, this.config.appMiddleware);
    for (const name of middlewareList) {
      this.use(this.middlewareMap[name]);
    }
  }

  loadController() {
    this.controller = {};

    const dir = path.join(this.baseDir, 'app/controller');
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const baseName = path.basename(file, '.js');
      this.controller[baseName] = require(path.join(dir, file));
    }
  }

  loadRouter() {
    this.router = new Router();
    // load router file
    const mod = require(path.join(this.baseDir, 'app/router.js'));
    // mount router
    mod(this);
    this.use(this.router.routes());
    this.use(this.router.allowedMethods());
  }
};
