import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import store from './store'
import axios from 'axios'


Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
    store
}).$mount('#app')
