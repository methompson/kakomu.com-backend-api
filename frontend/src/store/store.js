import Vue from 'vue';
import Vuex from 'vuex';

import * as auth_store from './auth_store';
import * as message_store from './message_store';
import * as post_store from './post_store';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    restUrl: 'http://localhost:3000',
    authToken: "",
    authPayload: {},
    message: "",
  },
  mutations: {
    ...auth_store.mutations,
    ...message_store.mutations,
    ...post_store.mutations,
  },
  actions: {
    ...auth_store.actions,
    ...message_store.actions,
    ...post_store.actions,
  },
  modules: {
  },
});
