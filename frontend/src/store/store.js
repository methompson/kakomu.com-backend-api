import Vue from 'vue';
import Vuex from 'vuex';

import * as authStore from './auth-store';
import * as messageStore from './message-store';
import * as postStore from './post-store';
import * as userStore from './user-store';
import defaultState from './default-state';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...defaultState
  },
  mutations: {
    ...authStore.mutations,
    ...messageStore.mutations,
    ...postStore.mutations,
    ...userStore.mutations,
  },
  actions: {
    ...authStore.actions,
    ...messageStore.actions,
    ...postStore.actions,
    ...userStore.actions,
  },
  // getters: {
  //   ...messageStore.getters,
  // },
  modules: {
  },
});
