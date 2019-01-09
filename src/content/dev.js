import qs from 'query-string';

import startApp from './startApp';

const DEFAULT_XML = '/xml/default.xml';

// ?xml=/xml/test.xml
async function fetchDevXml(url) {
  const response = await fetch(url);
  const raw = await response.text();
  return (new DOMParser()).parseFromString(raw, 'text/xml');
}

(async () => {
  const params = qs.parse(window.location.search);
  const path = params.xml || DEFAULT_XML;
  const xml = await fetchDevXml(path);
  const url = new URL(path, window.location.href);
  startApp(xml, url.href);
})();
