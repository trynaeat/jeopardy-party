import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles.scss';

import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
Vue.config.productionTip = false;

axios.defaults.baseURL = 'https://0.0.0.0:3000';
Vue.use(VueAxios, axios);
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://0.0.0.0:3001',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
}));

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
