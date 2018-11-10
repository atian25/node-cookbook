'use strict';

module.exports = () => {
  const config = {};

  // add your config here
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
      '.tpl': 'nunjucks',
    },
  };

  return config;
};
