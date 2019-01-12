import Vue from 'vue';

import App from './App';
import store from '../ui/store';

Vue.config.productionTip = false;
Vue.prototype.$xml = null;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
