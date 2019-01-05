import Vue from 'vue';
import $ from 'jquery';

import App from './App';
import processXmlStore from './store';

Vue.config.productionTip = false;

const startApp = async (xmlDoc, { isDev = false } = {}) => {
  console.time('init');
  const { store, xml } = processXmlStore(xmlDoc);
  Vue.prototype.$xml = xml;
  Vue.prototype.$isDev = isDev;

  window.x = {
    doc: xmlDoc,
    root: xml.root,
    $: $(xml.root),
    history: [],
  };

  new Vue({
    store,
    render: h => h(App),
  }).$mount('#app');
};

export default startApp;
