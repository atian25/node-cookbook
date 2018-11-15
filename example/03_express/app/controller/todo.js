'use strict';

const { UnprocessableEntity } = require('http-errors');

// 简化示例，直接全局变量存储数据。
const Todo = require('../model/todo');
const db = new Todo();

// 查询列表，支持过滤 `/api/todo?completed=true`
exports.index = function(req, res, next) {
  // query 参数均为字符串，需转换
  let { completed } = req.query;
  if (req.query.completed !== undefined) completed = completed === 'true';

  db.list({ completed }, (err, data) => {
    if (err) return next(err); // 错误处理
    // 发送响应
    res.status(200);
    res.json(data);
  });
};

// 创建任务
exports.create = function(req, res, next) {
  // 数据校验
  if (!req.body.title) return next(new UnprocessableEntity('task title required'));

  // `req.body` 为上一个中间件的产物
  db.create(req.body, (err, data) => {
    if (err) return next(err); // 错误处理
    // 发送响应
    res.status(201);
    res.json(data);
  });
};

// 修改任务
exports.update = function(req, res, next) {
  // 数据校验
  if (!req.body.title) return next(new UnprocessableEntity('task title required'));

  // URL 匹配参数
  const { id } = req.params;
  db.update(id, req.body, err => {
    if (err) return next(err); // 错误处理
    // 发送响应，无需返回对象
    res.status(204);
    res.type('json');
    res.end();
  });
};

// 删除任务
exports.destroy = function(req, res, next) {
  // URL 匹配参数
  const { id } = req.params;
  db.destroy(id, err => {
    if (err) return next(err); // 错误处理
    // 发送响应，无需返回对象
    res.status(204);
    res.type('json');
    res.end();
  });
};
