'use strict';

module.exports = () => {
  return async (ctx, next) => {
    // 测试用
    await next();
  };
};
