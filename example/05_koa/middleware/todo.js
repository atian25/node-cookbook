'use strict';

// 简化示例，直接全局变量存储数据。
const todoList = [
  { id: '1', title: 'Forgot Express', completed: true },
  { id: '2', title: 'Learn Koa', completed: true },
  { id: '3', title: 'Learn Egg', completed: false },
];

// 查询列表，支持过滤 `/api/todo?completed=true`
exports.list = async ctx => {
  const { query } = ctx;
  let data = todoList;

  // 查询列表，从而过滤参数
  if (query.completed !== undefined) {
    // query 参数均为字符串，需转换
    query.completed = query.completed === 'true';
    data = todoList.filter(x => x.completed === query.completed);
  }

  // 返回响应
  ctx.status = 200;
  ctx.body = data;
};

// 创建任务
exports.add = async ctx => {
  // body-parser 中间件的产物
  const todo = ctx.request.body;

  // 补全数据，保存
  todo.id = Date.now().toString();
  todo.completed = false;
  todoList.push(todo);

  // 发送响应
  ctx.status = 201;
  ctx.body = todo;
};

// 修改任务
exports.update = async ctx => {
  // body-parser 中间件的产物
  let todo = ctx.request.body;
  const { id } = todo;

  // 查找对应 ID 的任务对象
  const index = id ? todoList.findIndex(x => x.id === id) : -1;

  // 未找到
  if (index === -1) {
    ctx.status = 404;
    ctx.statusMessage = `task#${id} not found`;
    return;
  }

  // 修改 todo 对象，并更新状态
  todo = Object.assign(todoList[index], todo);

  // 发送响应
  ctx.status = 204;
};

// 删除操作
exports.remove = async ctx => {
  // URL 匹配参数
  const { id } = ctx.params;

  // 查找对应 ID 的任务对象
  const index = id ? todoList.findIndex(x => x.id === id) : -1;

  // 未找到
  if (index === -1) {
    ctx.status = 404;
    ctx.statusMessage = `task#${id} not found`;
    return;
  }

  // 删除对象
  todoList.splice(index, 1);
  ctx.status = 204;
};
