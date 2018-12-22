import startApp from '../ui';

const NAMESPACE = 'http://www.w3.org/1999/xhtml';

function initApp(xml) {
  const cssUrl = chrome.runtime.getURL('css/content.css');
  document.head.innerHTML = `<link rel="stylesheet" href="${cssUrl}" />`;
  const body = '<div id="webkit-xml-viewer-source-xml"></div><div id="app"></div>';

  document.body.innerHTML = body;
  // must replace `document.createElement` so Vue can create Elements with styles
  document.createElement = (tag, opts) => document.createElementNS(NAMESPACE, tag, opts);
  startApp(xml);
}

document.addEventListener('readystatechange', () => {
  console.log('onload', document.readyState);

  const xmlElement = document.getElementById('webkit-xml-viewer-source-xml');
  // XML element does not have style attribute
  if (xmlElement && !document.createElement('a').style) {
    xmlElement.parentNode.removeChild(xmlElement);
    initApp(xmlElement);
    return;
  }

  chrome.runtime.sendMessage('QUERY_XML', async (xmlType) => {
    if (!xmlType) return;
    console.log({ xmlType });

    if (xmlType === 'XML' && xmlElement) {
      xmlElement.parentNode.removeChild(xmlElement);
      initApp(xmlElement);
      return;
    }

    if (xmlType.includes('text/plain')) {
      const raw = document.querySelector('pre').innerText;
      if (!raw) return;
      try {
        const xml = (new DOMParser()).parseFromString(raw, 'text/xml');
        initApp(xml);
      } catch (e) {
        console.error(e);
      }
    }
  });
});
