'use strict';

module.exports = () => {
  const config = {};

  config.middleware = [ 'cors' ];

  config.cors = {
    origin: '*',
  };

  return config;
};

