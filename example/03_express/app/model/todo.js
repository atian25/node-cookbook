'use strict';

// 简化起见，全局变量存储
const dataStore = [
  { id: '1', title: 'Read history of Node.js', completed: true },
  { id: '2', title: 'Learn Koa', completed: true },
  { id: '3', title: 'Star Egg', completed: false },
];

module.exports = class TodoStore {
  constructor() {
    this.store = dataStore;
  }

  // 查询任务列表，支持可选过滤参数 { completed }
  list(filters, callback) {
    const { completed } = filters;
    let list = this.store;
    if (completed !== undefined) {
      list = list.filter(x => x.completed === completed);
    }
    callback(undefined, list);
  }

  // 查询任务对象，找不到对象会抛错
  get(id, callback) {
    const index = id ? this.store.findIndex(x => x.id === id) : -1;
    if (index === -1) return callback(new Error(`task#${id} not found`));
    callback(undefined, this.store[index], index);
  }

  // 添加任务，会校验 title 属性
  create(todo, callback) {
    // 校验数据
    if (!todo.title) return callback(new Error('task title required'));

    // 补全数据，保存
    todo.id = Date.now().toString();
    todo.completed = false;
    this.store.push(todo);
    callback(undefined, todo);
  }

  // 修改任务，找不到对象会抛错
  update(id, data, callback) {
    // 检查是否存在
    this.get(id, (err, todo) => {
      if (err) return callback(err);
      if (!data.title) return callback(new Error('task title required'));
      // 修改 todo 对象，并更新状态
      Object.assign(todo, data);
      callback(undefined, todo);
    });
  }

  // 删除任务，找不到对象会抛错
  destroy(id, callback) {
    // 检查是否存在
    this.get(id, (err, todo, index) => {
      if (err) return callback(err);

      // 删除对象
      this.store.splice(index, 1);
      callback(undefined, todo);
    });
  }
};
