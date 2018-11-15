'use strict';

const { NotFound } = require('http-errors');

module.exports = () => {
  return (req, res, next) => {
    return next(new NotFound('Not Found'));
  };
};
