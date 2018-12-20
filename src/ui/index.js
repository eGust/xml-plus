import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

const startApp = async (xmlDoc, { isDev = false } = {}) => {
  Vue.prototype.$xml = xmlDoc.documentElement;
  Vue.prototype.$isDev = isDev;
  Vue.prototype.$settings = {};

  new Vue({
    render: h => h(App),
  }).$mount('#app');
};

export default startApp;
