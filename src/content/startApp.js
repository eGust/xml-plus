import Vue from 'vue';
import $ from 'jquery';

import App from './App';
import { processXml, store } from '../ui/store';

Vue.config.productionTip = false;

export default (xmlDoc, url) => {
  console.time('init');
  const xml = processXml(xmlDoc);
  Vue.prototype.$xml = xml;
  store.state.url = url;

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
