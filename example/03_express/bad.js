'use strict';

const express = require('express');
const app = new express();

app.use((req, res, next) => {
  res.set('Content-Type', 'text/plain');
  res.set('x-start', Date.now());
  next();
});

app.use((req, res, next) => {
  // 此时不应该继续执行后续中间件了
  res.send('hello');
  // res.send('hello2');
  next();
});

app.use((req, res, next) => {
  setTimeout(next, 5000);
});

app.use((req, res, next) => {
  // 初学者常见错误：Can't set headers after they are sent.
  res.set('x-end', Date.now());
  next();
});

// 启动服务
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
