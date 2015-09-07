
export default function flatten(array) {
  if (!Array.isArray(array)) return array;
  return array.reduce(function(list, item) {
    if (Array.isArray(item)) return list.concat(flatten(item));
    return list.concat(item);
  }, []);
}
