'use strict';

// 简化示例，直接全局变量存储数据。
const todoList = [
  { id: 1, title: 'Forgot Express', completed: true },
  { id: 2, title: 'Learn Koa', completed: true },
  { id: 3, title: 'Learn Egg', completed: false },
];

// 查询列表，支持过滤
exports.list = function(req, res) {
  const { query } = req;
  let data = todoList;

  // 查询列表，支持过滤参数 `/api/list?completed=true`
  if (query.completed !== undefined) {
    query.completed = query.completed === 'true';
    data = todoList.filter(x => x.completed === query.completed);
  }
  res.status(200);
  res.json(data);
};

// 更新操作
exports.update = function(req, res) {
  // body-parser 中间件的产物
  let todo = req.body;

  if (!todo.id) {
    // 无 ID 则新增
    todo.id = Date.now();
    todo.completed = false;
    todoList.push(todo);
  } else {
    // 修改，查找 todo 对象，并更新状态
    const data = todoList.find(x => x.id === todo.id);
    todo = Object.assign(data, todo);
  }

  // 发送响应
  res.status(200);
  return res.json(todo);
};

// 删除操作
exports.remove = function(req, res) {
  const id = Number(req.query.id);
  const index = todoList.findIndex(x => x.id === id);
  // not found
  if (index === -1) {
    res.statusCode = 404;
    res.statusMessage = `task#${id} not found`;
    return res.end();
  }
  // deleted
  todoList.splice(index, 1);
  res.statusCode = 204;
  return res.end();
};
