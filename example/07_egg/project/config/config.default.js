'use strict';

module.exports = appInfo => {
  const config = {};

  // Cookie 的 key
  config.keys = appInfo.name + '_1501832752131_9495';

  config.security = {
    // csrf: false,
  };

  config.cluster = {
    listen: {
      port: 3000,
    },
  };

  return config;
};
