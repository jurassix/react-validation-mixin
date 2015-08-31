
export default function result(object, path, defaultValue) {
  if (object === null || object === undefined || path === null || path === undefined) {
    return defaultValue;
  }
  const data = object[path];
  if (data === null || data === undefined) {
    return defaultValue;
  }
  if (typeof data === 'function') {
    return data.apply(object);
  }
  return data;
}
