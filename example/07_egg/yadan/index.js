'use strict';

const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');

class Application extends egg.Application {
  get [EGG_PATH]() {
    return __dirname;
  }
}

class Agent extends egg.Agent {
  get [EGG_PATH]() {
    return __dirname;
  }
}

module.exports = Object.assign(egg, {
  Application,
  Agent,
});
