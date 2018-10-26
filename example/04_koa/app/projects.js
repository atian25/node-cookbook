'use strict';

// 列出数据
exports.list = async ctx => {
  ctx.body = {
    list: [ 'Node', 'Koa', 'Egg' ],
  };
};

// 单个详情
exports.detail = async ctx => {
  const name = ctx.query.name || 'unknown';

  // 读取 cookie
  let stat = ctx.cookies.get('koa_stat');
  stat = stat ? JSON.parse(stat) : {};

  // 统计当前 key 的访问次数，并自增
  let count = stat[name] || 0;
  stat[name] = ++count;

  // 写入 cookie
  ctx.cookies.set('koa_stat', JSON.stringify(stat));

  // 返回数据
  ctx.body = {
    name,
    desc: `this is detail of ${name}, visit ${count} times`,
  };
};
