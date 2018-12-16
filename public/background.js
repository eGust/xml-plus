const urlTypes = {};
const XML_TYPES = ['text/xml', 'application/xml'];

function detectXml(event) {
  const { responseHeaders: headers, url: rawUrl } = event;
  if (!headers) return;

  const contentType = (headers.find(({ name }) => name.toLowerCase() === 'content-type')
    .value || '').toLowerCase();
  console.log('detectXml', { contentType, event });

  if (XML_TYPES.find(type => contentType.includes(type))) {
    urlTypes[rawUrl] = 'XML';
    return;
  }

  const url = new URL(rawUrl);
  if (url.pathname.toLowerCase().endsWith('.xml')) {
    urlTypes[rawUrl] = contentType;
  }
}

chrome.webRequest.onHeadersReceived.addListener(
  detectXml,
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['blocking', 'responseHeaders'],
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { url } = sender;
  const contentType = urlTypes[url];
  if (!contentType) {
    sendResponse(url.toLowerCase().endsWith('.xml') && 'XML');
    return;
  }

  delete urlTypes[url];
  sendResponse(contentType);
});
