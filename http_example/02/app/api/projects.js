'use strict';

exports.list = function(req, res) {
  const data = { list: [ 'Node', 'Koa', 'Egg' ] };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data, null, 2));
};
