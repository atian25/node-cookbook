'use strict';

// 简化示例，直接全局变量存储数据。
const todoList = [
  { id: '1', title: 'Forgot Express', completed: true },
  { id: '2', title: 'Learn Koa', completed: true },
  { id: '3', title: 'Learn Egg', completed: false },
];

// 查询列表，支持过滤 `/api/todo?completed=true`
exports.list = function(req, res) {
  const { query } = req;
  let data = todoList;

  // 查询列表，从而过滤参数
  if (query.completed !== undefined) {
    // query 参数均为字符串，需转换
    query.completed = query.completed === 'true';
    data = todoList.filter(x => x.completed === query.completed);
  }
  res.status(200);
  res.json(data);
};

// 创建任务
exports.add = function(req, res) {
  // body-parser 中间件的产物
  const todo = req.body;

  // 补全数据，保存
  todo.id = Date.now().toString();
  todo.completed = false;
  todoList.push(todo);

  // 发送响应
  res.status(201);
  return res.json(todo);
};

// 修改任务
exports.update = function(req, res) {
  // body-parser 中间件的产物
  let todo = req.body;
  const { id } = todo;

  // 查找对应 ID 的任务对象
  const index = id ? todoList.findIndex(x => x.id === id) : -1;

  // 未找到
  if (index === -1) {
    res.status(404);
    res.statusMessage = `task#${id} not found`;
    return res.end();
  }

  // 修改 todo 对象，并更新状态
  todo = Object.assign(todoList[index], todo);

  // 发送响应
  res.status(204);
  return res.end();
};

// 删除任务
exports.remove = function(req, res) {
  // URL 匹配参数
  const { id } = req.params;

  // 查找对应 ID 的任务对象
  const index = id ? todoList.findIndex(x => x.id === id) : -1;

  // 未找到
  if (index === -1) {
    res.status(404);
    res.statusMessage = `task#${id} not found`;
    return res.end();
  }

  // 删除对象
  todoList.splice(index, 1);
  res.status(204);
  return res.end();
};
