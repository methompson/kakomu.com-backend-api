import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';
import Post from '../views/Post.vue';
import About from '../views/About.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/post/:slug',
    name: 'post',
    component: Post,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue'),
  },
  {
    path: '/admin-post-list',
    name: 'admin-post-list',
    component: () => import(/* webpackChunkName: "account" */ '../views/AdminPostList.vue'),
  },
  {
    path: '/edit-account',
    name: 'edit-account',
    component: () => import(/* webpackChunkName: "account" */ '../views/EditUser.vue'),
  },
  {
    path: '/add-post',
    name: 'add-post',
    component: () => import(/* webpackChunkName: "add-post" */ '../views/PostAdd.vue'),
  },
  {
    path: '/edit-post/:slug',
    name: 'edit-post',
    component: () => import(/* webpackChunkName: "edit-post" */ '../views/PostEdit.vue'),
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
