import debounce from 'lodash/debounce';

import CSS from './css';
import XPath from './xPath';
import jQuery from './jQuery';
import Text from './text';
import RegExpr from './regExpr';

const searchCalls = {
  Text,
  RegExpr,
  CSS,
  jQuery,
  XPath,
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
