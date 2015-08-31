
export default function flatten(array) {
  if (!Array.isArray(array)) return array;
  return array.reduce(function(memo, item) {
    if (Array.isArray(item)) return memo.concat(flatten(item));
    return memo.concat(item);
  }, []);
}
