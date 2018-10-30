'use strict';
/* global Vue:false, axios:false */

new Vue({
  el: '#app',
  data: {
    list: [],
    detail: '',
  },
  methods: {
    listData() {
      axios.get('/api/projects').then(res => {
        this.list = res.data.list;
        this.detail = 'click title to see detail';
      });
    },
    showDetail(name) {
      this.detail = 'Loading...';
      axios.get(`/api/projects/detail?name=${name}`).then(res => {
        this.detail = res.data.desc;
      });
    },
  },
  mounted() {
    this.listData();
  },
});
