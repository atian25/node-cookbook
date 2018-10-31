'use strict';

// 简化示例，直接全局变量存储数据。
const todoList = [
  { id: 1, title: 'Forgot Express', completed: true },
  { id: 2, title: 'Learn Koa', completed: true },
  { id: 3, title: 'Learn Egg', completed: false },
];

// 查询列表，支持过滤
exports.list = async ctx => {
  const { query } = ctx;
  let data = todoList;

  // 查询列表，支持过滤参数 `/api/list?completed=true`
  if (query.completed !== undefined) {
    query.completed = query.completed === 'true';
    data = todoList.filter(x => x.completed === query.completed);
  }

  // 返回响应
  ctx.status = 200;
  ctx.body = data;
};

// 更新操作
exports.update = async ctx => {
  // body-parser 中间件的产物
  let todo = ctx.request.body;

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
  ctx.status = 200;
  ctx.body = todo;
};

// 删除操作
exports.remove = async ctx => {
  const id = Number(ctx.query.id);
  const index = todoList.findIndex(x => x.id === id);
  // not found
  if (index === -1) {
    ctx.status = 404;
    ctx.message = `task#${id} not found`;
    return;
  }
  // deleted
  todoList.splice(index, 1);
  ctx.status = 204;
};
