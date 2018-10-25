'use strict';

exports.list = function(req, res) {
  const data = { list: [ 'Node', 'Koa', 'Egg' ] };
  res.status(200);
  res.json(data);
  res.end();
};
