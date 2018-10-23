'use strict';

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'));

module.exports = async ctx => {
  ctx.body = html;
};
