import defined from './defined';

export default function isEmpty(obj) {
  if (!defined(obj)) return true;
  return Object.keys(obj).length === 0;
}
