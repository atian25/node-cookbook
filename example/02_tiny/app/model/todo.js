'use strict';

module.exports = class Todo {
  constructor(arr) {
    this.store = arr || [];
  }

  // 查询任务列表，支持可选过滤参数 { completed }
  find(filters, callback) {
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
    callback(undefined, this.store[index]);
  }

  // 添加任务，会校验 title 属性
  add(todo, callback) {
    // 校验数据
    if (!todo.title) return callback(new Error('task title required'));

    // 补全数据，保存
    todo.id = Date.now().toString();
    todo.completed = false;
    this.store.push(todo);
    callback(undefined, todo);
  }

  // 修改任务，找不到对象会抛错
  update(todo, callback) {
    // 检查是否存在
    this.get(todo.id, (err, data) => {
      if (err) return callback(err);
      if (!todo.title) return callback(new Error('task title required'));
      // 修改 todo 对象，并更新状态
      todo = Object.assign(data, todo);
      callback(undefined, todo);
    });
  }

  // 删除任务，找不到对象会抛错
  remove(id, callback) {
    const index = id ? this.store.findIndex(x => x.id === id) : -1;
    if (index === -1) return callback(new Error(`task#${id} not found`));

    // 删除对象
    const todo = this.store.splice(index, 1);
    callback(undefined, todo);
  }
};
