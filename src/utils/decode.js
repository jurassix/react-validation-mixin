import he from 'he';
import defined from './defined';

export default function decode(list, key) {
  if (defined(list, key)) {
    return list[key] ? list[key].map(he.decode) : [];
  }
}
