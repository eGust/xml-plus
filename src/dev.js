import qs from 'query-string';

import startApp from './ui';

const DEFAULT_XML = '/xml/default.xml';

// ?xml=/xml/test.xml
async function fetchXml(path) {
  const response = await fetch(path || DEFAULT_XML);
  const raw = await response.text();
  return (new DOMParser()).parseFromString(raw, 'text/xml');
}

(async () => {
  const params = qs.parse(window.location.search);
  const xml = await fetchXml(params.xml);
  startApp(xml, { isDev: true });
})();
