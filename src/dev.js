import Vue from 'vue';
import qs from 'query-string';
import App from './content/App.vue';
import createStore from './content/store';

Vue.config.productionTip = false;

const DEFAULT_XML = '/xml/default.xml';

// ?xml=/xml/test.xml
async function fetchXml(path) {
  const response = await fetch(path || DEFAULT_XML);
  const stream = await response.body;
  const reader = stream.getReader();
  const buffer = await reader.read();
  const raw = (new TextDecoder()).decode(buffer.value);

  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, 'text/xml');

  return { doc, raw };
}

(async () => {
  const params = qs.parse(window.location.search);
  const store = createStore(await fetchXml(params.xml));
  new Vue({
    store,
    render: h => h(App),
  }).$mount('#app');
})();
