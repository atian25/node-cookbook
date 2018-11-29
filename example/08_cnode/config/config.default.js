'use strict';

module.exports = appInfo => {
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1542379482201_916';

  // add your config here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
      '.tpl': 'nunjucks',
    },
  };

  config.passportGithub = {
    key: 'bcea0029d6b98569c71f',
    secret: '5ef1665f62af76ca2e891ba03666745cbd9d0f47',
  };

  return config;
};
