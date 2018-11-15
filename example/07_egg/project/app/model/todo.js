'use strict';

const dataStore = [
  { id: '1', title: 'Read history of Node.js', completed: true },
  { id: '2', title: 'Learn Koa', completed: true },
  { id: '3', title: 'Star Egg', completed: false },
];

module.exports = class TodoStore {
  constructor(ctx) {
    this.ctx = ctx;
    this.store = dataStore;
  }

  // 查询任务列表，支持可选过滤参数 { completed }
  async list(filters) {
    const { completed } = filters;
    let list = this.store;
    if (completed !== undefined) {
      list = list.filter(x => x.completed === completed);
    }
    return list;
  }

  // 查询任务对象，找不到对象会抛错
  async get(id) {
    const index = id ? this.store.findIndex(x => x.id === id) : -1;
    if (index === -1) this.ctx.throw(500, `task#${id} not found`);
    return this.store[index];
  }

  // 添加任务，会校验 title 属性
  async create(todo) {
    // 校验数据
    if (!todo.title) this.ctx.throw(422, 'task title required');

    // 补全数据，保存
    todo.id = Date.now().toString();
    todo.completed = false;
    this.store.push(todo);
    return todo;
  }

  // 修改任务，找不到对象会抛错
  async update(id, todo) {
    // 检查是否存在
    const data = await this.get(id);
    if (!todo.title) this.ctx.throw(442, 'task title required');

    // 修改 todo 对象，并更新状态
    return Object.assign(data, todo);
  }

  // 删除任务，找不到对象会抛错
  async destroy(id) {
    const index = id ? this.store.findIndex(x => x.id === id) : -1;
    if (index === -1) this.ctx.throw(500, `task#${id} not found`);

    // 删除对象
    return this.store.splice(index, 1);
  }
};
