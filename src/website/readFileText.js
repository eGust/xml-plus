export default (file, encoding) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = ({ target: { result } }) => resolve(result);
  reader.onerror = ({ error }) => reject(error);
  reader.readAsText(file, encoding);
});
