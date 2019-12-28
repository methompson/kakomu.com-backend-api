import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';

import * as prototypes from './shared/auth_prototypes';

Vue.config.productionTip = false;

Vue.prototype.$loggedIn = prototypes.$loggedIn;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
