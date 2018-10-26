'use strict';

// 列出数据
exports.list = function(req, res) {
  const data = {
    list: [ 'Node', 'Koa', 'Egg' ],
  };
  res.status(200);
  res.json(data);
};

// 单个详情
exports.detail = function(req, res) {
  const name = req.query.name || 'unknown';

  // 读取 cookie
  const stat = req.cookies.express_stat || {};

  // 统计当前 key 的访问次数，并自增
  let count = stat[name] || 0;
  stat[name] = ++count;

  // 写入 cookie
  res.cookie('express_stat', stat);

  // 返回数据
  const data = {
    name,
    desc: `this is detail of ${name}, visit ${count} times`,
  };
  res.status(200);
  res.json(data);
};
