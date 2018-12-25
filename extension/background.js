const tabTypes = {};
const XML_TYPES = ['text/xml', 'application/xml'];

// prevent Chrome slowness of loading big `xml` responses (>1MB)
const CONTENT_TYPE_OVERRIDE = { responseHeaders: [{ name: 'Content-Type', value: 'text/plain' }] };

function detectXml(event) {
  const { responseHeaders: headers, tabId, url: rawUrl } = event;
  if (!headers) return {};

  const contentType = (headers.find(({ name }) => name.toLowerCase() === 'content-type')
    .value || '').toLowerCase();
  console.debug('detectXml', { contentType, event });

  if (XML_TYPES.find(type => contentType.includes(type))) {
    tabTypes[tabId] = 'XML';
    return CONTENT_TYPE_OVERRIDE;
  }

  const url = new URL(rawUrl);
  if (url.pathname.toLowerCase().endsWith('.xml')) {
    tabTypes[tabId] = contentType;
    return CONTENT_TYPE_OVERRIDE;
  }
  return {};
}

chrome.webRequest.onHeadersReceived.addListener(
  detectXml,
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['blocking', 'responseHeaders'],
);

chrome.runtime.onMessage.addListener((_message, sender, sendResponse) => {
  const { url, tab: { id: tabId } } = sender;
  const contentType = tabTypes[tabId];
  if (!contentType) {
    sendResponse(url.toLowerCase().endsWith('.xml') && 'XML');
    return;
  }

  delete tabTypes[url];
  sendResponse(contentType);
});
