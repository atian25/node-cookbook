'use strict';

const path = require('path');

module.exports = appInfo => {
  const { baseDir } = appInfo;

  const config = {};

  config.coreMiddleware = [
    'static',
    'access_log',
    'error_handler',
    'body_parser',
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

