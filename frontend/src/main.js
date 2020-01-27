import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

import router from './router/router';
import store from './store/store';

import * as prototypes from './shared/auth_prototypes';

import App from './components/App.vue';

import './assets/styles.scss';

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

Vue.prototype.$checkAuthData = prototypes.$checkAuthData;
Vue.prototype.$checkAuthAndRedirect = prototypes.$checkAuthAndRedirect;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
