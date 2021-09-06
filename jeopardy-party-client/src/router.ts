import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Online from './views/Online.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/online',
      name: 'online',
      component: Online,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/play/:id',
      name: 'play',
      component: () => import('./views/PlayGame.vue'),
    },
  ],
});
