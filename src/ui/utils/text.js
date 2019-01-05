function search(node, text) {
  if (!node.outerHTML.includes(text)) return [];

  const { innerHTML, childElementCount } = node;
  if (!childElementCount || !innerHTML.includes(text)) return [node];

  return Array.from(node.children).flatMap(n => search(n, text));
}

export default search;
