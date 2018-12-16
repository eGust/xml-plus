import qs from 'query-string';
import cheerio from 'cheerio';

import startApp from './ui';

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
  const xml = await fetchXml(params.xml);
  const $ = cheerio.load(xml.raw);
  window.x = { $, n: xml.doc.children[0], ...xml };
  startApp(xml, { isDev: true });
})();
