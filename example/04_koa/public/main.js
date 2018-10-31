'use strict';
/* global Vue:false, axios:false */
/* eslint object-shorthand: 0 */

new Vue({
  el: '#app',
  data: {
    todoList: [],
    newTodo: '',
    completed: 'all',
  },
  methods: {
    listData: function(completed) {
      // 简化处理，忽略错误处理和加载提示
      axios.get('/api/list', { params: { completed } })
        .then(res => {
          this.todoList = res.data;
        });
    },

    addTodo: function() {
      const value = this.newTodo && this.newTodo.trim();
      if (!value) return;

      const item = {
        title: value,
        completed: false,
      };

      axios.post('/api/update', item)
        .then(res => {
          this.todoList.push(res.data);
          this.newTodo = '';
        });
    },

    completeTodo: function(todo) {
      todo.completed = !todo.completed;
      axios.post('/api/update', todo)
        .then(res => {
          Object.assign(todo, res.data);
          this.newTodo = '';
        });
    },

    removeTodo: function(todo) {
      axios.delete(`/api/remove?id=${todo.id}`)
        .then(() => {
          const id = Number(todo.id);
          const index = this.todoList.findIndex(x => x.id === id);
          this.todoList.splice(index, 1);
        });
    },
  },

  mounted() {
    this.listData();
  },
});
