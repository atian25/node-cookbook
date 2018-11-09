'use strict';

const path = require('path');

module.exports = appInfo => {
  const { baseDir } = appInfo;

  const config = {};

  config.coreMiddleware = [
    'static',
    'error_handler',
    'body_parser',
    'access_log',
    'not_found',
  ];

  config.middleware = [];

  config.static = {
    prefix: '/public',
    dir: path.join(baseDir, 'app/public'),
    dynamic: true,
    preload: false,
  };

  return config;
};

