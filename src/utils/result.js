import defined from './defined';

export default function result(object, path, defaultValue) {
  if (!defined(object, path)) {
    return defaultValue;
  }
  const data = object[path];
  if (!defined(data)) {
    return defaultValue;
  }
  if (typeof data === 'function') {
    return data.apply(object);
  }
  return data;
}
