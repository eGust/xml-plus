import startApp from '../ui';

const NAMESPACE = 'http://www.w3.org/1999/xhtml';

function retrieveXml(xmlType) {
  try {
    if (xmlType === 'XML') {
      const doc = document.getElementById('webkit-xml-viewer-source-xml');
      doc.parentNode.removeChild(doc);

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

function init() {
  chrome.runtime.sendMessage('QUERY_XML', async (xmlType) => {
    if (!xmlType) return;

    const xml = retrieveXml(xmlType);
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
