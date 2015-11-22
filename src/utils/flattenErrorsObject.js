import values from 'lodash.values';
import flatten from 'lodash.flatten';

export default function flattenErrorsObject(obj) {
  if (typeof obj === 'string') {
    return obj;
  }

  return flatten(values(obj).map(value => {
    if (typeof obj !== 'string') {
      return flattenErrorsObject(value);
    }
    return value;
  }));
}
