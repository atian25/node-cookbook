'use strict';

// 查询列表，支持过滤 `/api/todo?completed=true`
exports.index = async ctx => {
  // query 参数均为字符串，需转换
  let { completed } = ctx.query;
  if (ctx.query.completed !== undefined) completed = completed === 'true';

  ctx.status = 200;
  ctx.body = await ctx.model.todo.list({ completed });
};

// 创建任务
exports.create = async ctx => {
  // `ctx.request.body` 为 body-parser 中间件的产物
  ctx.status = 201;
  ctx.body = await ctx.model.todo.create(ctx.request.body);
};

// 修改任务
exports.update = async ctx => {
  // `ctx.request.body` 为 body-parser 中间件的产物
  ctx.status = 204;
  ctx.type = 'json';
  ctx.body = await ctx.model.todo.update(ctx.params.id, ctx.request.body);
};

// 删除操作
exports.destroy = async ctx => {
  // URL 匹配参数
  const id = ctx.params.id;
  ctx.status = 204;
  ctx.type = 'json';
  await ctx.model.todo.destroy(id);
};
