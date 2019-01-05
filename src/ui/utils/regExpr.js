function search(re, node) {
  if (!re.test(node.outerHTML)) return [];

  const { innerHTML, childElementCount } = node;
  if (!childElementCount || !re.test(innerHTML)) return [node];

  return Array.from(node.children).flatMap(n => search(re, n));
}

export default (root, regex) => search(new RegExp(regex, 'i'), root);
