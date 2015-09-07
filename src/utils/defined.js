import isSome from './isSome';

export default function defined(...items) {
  if (Array.isArray(items)) {
    return items.every(item => !isSome(item, null, undefined));
  }
  return false;
}
