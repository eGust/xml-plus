import Vue from 'vue';
import App from './App';
import processXmlStore from './store';

Vue.config.productionTip = false;

const startApp = async (xmlDoc, { isDev = false } = {}) => {
  const { store, xml } = processXmlStore(xmlDoc);
  Vue.prototype.$xml = xml;
  Vue.prototype.$isDev = isDev;

  new Vue({
    store,
    render: h => h(App),
  }).$mount('#app');

  const xmlElement = document.getElementById('webkit-xml-viewer-source-xml');
  xmlElement.appendChild(xmlDoc.documentElement);
};

export default startApp;
