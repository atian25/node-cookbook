'use strict';

const Controller = require('yadan').Controller;

class TodoController extends Controller {
  // 查询列表，支持过滤 `/api/todo?completed=true`
  async index() {
    const { ctx } = this;

    // query 参数均为字符串，需转换
    let { completed } = ctx.query;
    if (ctx.query.completed !== undefined) completed = completed === 'true';

    ctx.status = 200;
    ctx.body = await ctx.model.todo.list({ completed });
  }

  // 创建任务
  async create() {
    const { ctx } = this;
    ctx.status = 201;
    ctx.body = await ctx.model.todo.add(ctx.request.body);
  }

  // 修改任务
  async update() {
    const { ctx } = this;
    ctx.status = 204;
    ctx.type = 'json';
    ctx.body = await ctx.model.todo.update(ctx.params.id, ctx.request.body);
  }

  // 删除操作
  async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;
    ctx.status = 204;
    ctx.type = 'json';
    await ctx.model.todo.destroy(id);
  }
}

module.exports = TodoController;
