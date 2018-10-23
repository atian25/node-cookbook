'use strict';

exports.list = async ctx => {
  ctx.body = {
    list: [ 'Node', 'Koa', 'Egg' ],
  };
};
