import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

const startApp = async (xml, { isDev = false } = {}) => {
  Vue.prototype.$xml = xml;
  Vue.prototype.$isDev = isDev;
  Vue.prototype.$settings = { indent: '    ' };

  new Vue({
    render: h => h(App),
  }).$mount('#app');
};

export default startApp;
