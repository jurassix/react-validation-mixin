import invariant from 'invariant';
import isEmpty from 'lodash.isempty';
import get from 'lodash.get';
import {decode, defined} from './utils';

export default function(strategy) {
  const _strategy = typeof strategy === 'function' ? strategy() : strategy;
  invariant(defined(_strategy), 'Validation strategy not provided. A user provided strategy is expected.');
  invariant(typeof _strategy !== 'function', 'Validation strategy improperly initialized. Refer to documentation of the provided strategy.');
  return {
    getValidationMessages: function(errors = {}, key) {
      if (isEmpty(errors)) {
        return [];
      }
      if (key === undefined) {
        return Object.keys(errors).map(decode.bind(this, errors));
      }
      return decode(errors, key);
    },
    isValid: function(errors, key) {
      if (!defined(key)) return isEmpty(errors);
      return isEmpty(get(errors, key));
    },
    ..._strategy,
  };
}
