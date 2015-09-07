import invariant from 'invariant';
import isEmpty from './utils/isEmpty';
import flatten from './utils/flatten';
import decode from './utils/decode';
import defined from './utils/defined';

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
        return flatten(Object.keys(errors).map(decode.bind(this, errors)));
      }
      return decode(errors, key);
    },
    isValid: function(errors, key) {
      return isEmpty(this.getValidationMessages(errors, key));
    },
    ..._strategy,
  };
}
