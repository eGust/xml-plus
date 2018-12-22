import Vue from 'vue';
import App from './App';
import processXmlStore from './store';

Vue.config.productionTip = false;

const startApp = async (xmlDoc, { isDev = false } = {}) => {
  console.time('init');
  const { store, xml } = processXmlStore(xmlDoc);
  Vue.prototype.$xml = xml;
  Vue.prototype.$isDev = isDev;

  new Vue({
    store,
    render: h => h(App),
  }).$mount('#app');
};

export default startApp;
