import Vue from 'vue';
import App from './App.vue';
import createStore from './store';

Vue.config.productionTip = false;

const BODY = '<body><div id="app"></div></body>';

function retrieveXml(xmlType) {
  if (xmlType === 'XML') {
    const node = document.getElementById('webkit-xml-viewer-source-xml');
    return {
      root: node,
      raw: node.innerHTML,
    };
  }

  return null;
}

chrome.runtime.sendMessage('QUERY_XML', (xmlType) => {
  if (!xmlType) return;

  const xml = retrieveXml(xmlType);
  console.log({ xmlType, xml });

  if (!xml) return;

  const store = createStore(xml);
  document.documentElement.innerHTML = BODY;
  new Vue({
    store,
    render: h => h(App),
  }).$mount('#app');
});
