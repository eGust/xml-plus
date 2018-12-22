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
  try {
    xmlElement.appendChild(xml.root);
  } catch (e) {
    console.error(e);
  }
};

export default startApp;
