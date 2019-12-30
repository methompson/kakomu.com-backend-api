import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';

import * as prototypes from './shared/auth_prototypes';

Vue.config.productionTip = false;

Vue.prototype.$checkAuthData = prototypes.$checkAuthData;
Vue.prototype.$checkAuthAndRedirect = prototypes.$checkAuthAndRedirect;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
