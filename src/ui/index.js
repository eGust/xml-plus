import Vue from 'vue';
import App from './App';
import createStore from './store';

Vue.config.productionTip = false;

const startApp = async (xmlDoc, { isDev = false } = {}) => {
  const root = xmlDoc.documentElement;
  Vue.prototype.$xml = root;
  Vue.prototype.$isDev = isDev;
  Vue.prototype.$settings = {};

  new Vue({
    store: createStore(root),
    render: h => h(App),
  }).$mount('#app');
};

export default startApp;
