const tabTypes = {};
const XML_TYPES = ['text/xml', 'application/xml'];

// prevent Chrome slowness of loading big `xml` responses (>1MB)
const CONTENT_TYPE_TEXT = { name: 'Content-Type', value: 'text/plain' };

function detectXml({ responseHeaders, tabId, url: rawUrl }) {
  if (!responseHeaders) return {};

  const contentHeader = responseHeaders.find(({ name }) => name.toLowerCase() === 'content-type');
  const contentType = (contentHeader && contentHeader.value) || '';
  if (XML_TYPES.find(type => contentType.toLowerCase().includes(type))) {
    tabTypes[tabId] = 'XML';
    contentHeader.value = contentType.replace(/(?:text|application)\/xml/, 'text/plain');
    return { responseHeaders };
  }

  const url = new URL(rawUrl);
  if (url.pathname.toLowerCase().endsWith('.xml')) {
    tabTypes[tabId] = contentType;
    if (contentHeader) {
      contentHeader.value = 'text/plain';
    } else {
      responseHeaders.push(CONTENT_TYPE_TEXT);
    }
    return { responseHeaders };
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
