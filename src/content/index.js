import startApp from '../ui';

const BODY = '<body><link href="chrome-extension://goandkhgmddfafhkmjebmicpjliohkco/css/content.css" rel="stylesheet" /><div id="app"></div></body>';

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
    document.body.outerHTML = BODY;
    const t = setTimeout(() => {
      clearTimeout(t);
      startApp(xml);
    }, 20);
  });
}

function onLoad() {
  console.log('onload');
  init();
}

document.addEventListener('readystatechange', onLoad);
