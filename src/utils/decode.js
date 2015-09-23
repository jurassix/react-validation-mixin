import he from 'he';
import get from 'lodash.get';
import defined from './defined';

export default function decode(list, key) {
  if (defined(list, key)) {
    const value = get(list, key);
    if (Array.isArray(value)) {
      return value.map(he.decode);
    }
    return value ? he.decode(value) : '';
  }
}
