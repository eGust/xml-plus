export default (root, selector) => {
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
};
