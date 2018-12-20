import startApp from '../ui';

const NAMESPACE = 'http://www.w3.org/1999/xhtml';

function parseXml(xmlType) {
  try {
    if (xmlType === 'XML') {
      const doc = document.getElementById('webkit-xml-viewer-source-xml');
      doc.parentNode.removeChild(doc);

      return doc;
    }

    if (xmlType.includes('text/plain')) {
      const raw = document.querySelector('pre').innerText;
      return (new DOMParser()).parseFromString(raw, 'text/xml');
    }
  } catch (e) { console.error(e); }
  return null;
}

function init() {
  chrome.runtime.sendMessage('QUERY_XML', async (xmlType) => {
    if (!xmlType) return;

    const xml = parseXml(xmlType);
    if (!xml) return;

    console.log({ xmlType, xml });

    const cssUrl = chrome.runtime.getURL('css/content.css');
    document.head.innerHTML = `<link rel="stylesheet" href="${cssUrl}" />`;
    const body = '<div id="app"></div>';

    document.body.innerHTML = body;
    // must replace `document.createElement` so Vue can create Elements with styles
    document.createElement = (tag, opts) => document.createElementNS(NAMESPACE, tag, opts);
    startApp(xml);
  });
}

function onLoad() {
  console.log('onload');
  init();
}

document.addEventListener('readystatechange', onLoad);
