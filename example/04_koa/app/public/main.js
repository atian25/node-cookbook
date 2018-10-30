'use strict';
/* global Vue:false, VueMaterial: false, axios:false */

Vue.use(VueMaterial.default);

new Vue({
  el: '#app',
  data: {
    list: [],
  },
  methods: {
    listData() {
      axios.get('/api/framework').then(res => {
        this.list = res.data.list;
      });
    },
    toggleStar(item) {
      axios.post('/api/framework/toggle', { name: item.name, star: !item.star }).then(res => {
        Object.assign(item, res.data);
      });
    },
  },
  mounted() {
    this.listData();
  },
});
