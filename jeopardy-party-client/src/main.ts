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

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
Vue.use(VueAxios, axios);
Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.VUE_APP_WS_BASE_URL,
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
