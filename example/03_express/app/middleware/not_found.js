'use strict';

module.exports = function(req, res) {
  const msg = `[Error] ${req.method} ${req.url} not found`;
  console.warn(msg);
  res.status(404);
  res.end(msg);
};
