import $ from 'jquery';
import debounce from 'lodash/debounce';

const searchCalls = {
  CSS: (root, selector) => root.querySelectorAll(selector),
  jQuery: (root, selector) => $(root).find(selector).toArray(),
  XPath: (root, selector) => {
    const result = document.evaluate(selector, root);
    switch (result.resultType) {
      case XPathResult.NUMBER_TYPE:
        return result.numberValue;
      case XPathResult.STRING_TYPE:
        return result.stringValue;
      case XPathResult.BOOLEAN_TYPE:
        return result.booleanValue;
      case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE: {
        const nodes = [];
        for (;;) {
          const node = result.iterateNext();
          if (!node) break;
          nodes.push(node);
        }
        return nodes;
      }
      default:
        throw TypeError(`Unsupported ${result.resultType}`);
    }
  },
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
