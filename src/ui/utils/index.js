import $ from 'jquery';
import debounce from 'lodash/debounce';

import css from './css';
import xPath from './xPath';
import jQuery from './jQuery';
import text from './text';
import regExpr from './regExpr';

export { default as formatSize } from './formatSize';
export { default as readFileText } from './readFileText';
export { default as parseXml } from './parseXml';

const searchCalls = {
  Text: text,
  RegExpr: regExpr,
  CSS: css,
  jQuery,
  XPath: xPath,
};

function startSearch({
  xmlElement, method, selector, preview, resolver,
}) {
  const query = selector.trim();
  const data = {
    base: xmlElement,
    method,
    query,
    preview,
    error: null,
    result: null,
  };

  if (!query) {
    resolver(data);
    return;
  }

  try {
    const result = searchCalls[method](xmlElement, query);
    resolver({ ...data, result });
  } catch (error) {
    resolver({ ...data, error });
  }
}

export const autoSearch = debounce(
  (args, resolver) => startSearch({ ...args, resolver, preview: true }),
  400,
);

export const searchSelector = (args, resolver) => startSearch({
  ...args,
  resolver,
  preview: false,
});

export const buildX = (xmlDoc, { root }) => ({
  doc: xmlDoc,
  root,
  cur: root,
  $: $(root),
  $q: (expr, el = root) => jQuery(el, expr),
  cs: (expr, el = root) => css(el, expr),
  re: (expr, el = root) => regExpr(el, expr),
  tx: (expr, el = root) => text(el, expr),
  xp: (expr, el = root) => xPath(el, expr),
  history: [],
});
