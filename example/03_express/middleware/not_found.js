'use strict';

module.exports = function(req, res) {
  res.status(404);
  res.end(`${req.method} ${req.url} not found`);
};
