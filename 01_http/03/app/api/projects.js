'use strict';

const URL = require('url');

exports.list = function(req, res) {
  const data = { list: [ 'Node', 'Koa', 'Egg' ] };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data, null, 2));
};

exports.detail = function(req, res) {
  const query = URL.parse(req.url, true).query;
  res.end(`this is detail of ${query.key}`);
};
