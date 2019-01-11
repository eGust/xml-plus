import startApp from './startApp';

const NAMESPACE = 'http://www.w3.org/1999/xhtml';

function initApp(xml) {
  const cssUrl = chrome.runtime.getURL('css/content.css');
  document.head.innerHTML = `<link rel="stylesheet" href="${cssUrl}" />`;
  const body = '<p id="loading-cloak">Loading...</p><div id="app"></div>';

  document.body.innerHTML = body;
  // must replace `document.createElement` so Vue can create Elements with styles
  document.createElement = (tag, opts) => document.createElementNS(NAMESPACE, tag, opts);
  startApp(xml);
}

chrome.runtime.sendMessage({ message: 'QUERY_XML' }, async (xmlType) => {
  console.debug({ xmlType });
  if (xmlType !== 'XML') return;

  const xmlElement = document.getElementById('webkit-xml-viewer-source-xml');
  if (xmlElement) {
    xmlElement.parentNode.removeChild(xmlElement);
    initApp(xmlElement);
    return;
  }

  const pre = document.querySelector('pre');
  if (!pre) return;
  try {
    const xml = (new DOMParser()).parseFromString(pre.innerText, 'text/xml');
    initApp(xml);
  } catch (e) {
    console.error(e);
  }
});

document.addEventListener('readystatechange', () => {
  const xmlElement = document.getElementById('webkit-xml-viewer-source-xml');
  // XML element does not have style attribute
  if (xmlElement && !document.createElement('a').style) {
    xmlElement.parentNode.removeChild(xmlElement);
    initApp(xmlElement);
  }
});
