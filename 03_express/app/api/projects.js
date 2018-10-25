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
  const data = {
    name,
    desc: `this is detail of ${name}`,
  };
  res.status(200);
  res.json(data);
};
