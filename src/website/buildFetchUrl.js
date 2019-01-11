export default PROXY === null ? s => s
  : PROXY && typeof PROXY === 'string'
    ? url => `${PROXY}${encodeURIComponent(url)}`
    : null;
