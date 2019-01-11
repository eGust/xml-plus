import Vue from 'vue';

import App from './App';
import { processXml, store } from '../ui/store';
import { buildX } from '../ui/utils';

Vue.config.productionTip = false;

export default (xmlDoc) => {
  console.time('init');
  const xml = processXml(xmlDoc);
  Vue.prototype.$xml = xml;
  store.state.url = window.location.href;

  window.x = buildX(xmlDoc, xml);

  new Vue({
    store,
    render: h => h(App),
  }).$mount('#app');
};
