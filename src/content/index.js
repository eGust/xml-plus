import startApp from '../ui';

const BODY = '<body><div id="app"></div></body>';

function retrieveXml(xmlType) {
  try {
    if (xmlType === 'XML') {
      const doc = document.getElementById('webkit-xml-viewer-source-xml');
      return {
        doc,
        raw: doc.innerHTML,
      };
    }

    if (xmlType.includes('text/plain')) {
      const raw = document.querySelector('pre').innerHTML;
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'text/xml');
      return { doc, raw };
    }

    return null;
  } catch (e) {
    return null;
  }
}

chrome.runtime.sendMessage('QUERY_XML', (xmlType) => {
  if (!xmlType) return;

  const xml = retrieveXml(xmlType);
  console.log({ xmlType, xml });

  if (!xml) return;

  document.documentElement.innerHTML = BODY;
  startApp(xml);
});
