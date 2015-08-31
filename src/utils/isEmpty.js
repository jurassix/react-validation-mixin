
export default function isEmpty(obj) {
  if (obj === null || obj === undefined) return true;
  return Object.keys(obj).length === 0;
}
