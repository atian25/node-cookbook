'use strict';

const Koa = require('koa');

const app = new Koa();

app.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
