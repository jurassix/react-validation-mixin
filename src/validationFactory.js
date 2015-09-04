import invariant from 'invariant';
import isEmpty from './utils/isEmpty';
import flatten from './utils/flatten';
import he from 'he';

export default function(strategy) {
  const _strategy = typeof strategy === 'function' ? strategy() : strategy;
  invariant(_strategy !== null && _strategy !== undefined, 'Validation strategy not provided. A user provided strategy is expected.');
  invariant(typeof _strategy !== 'function', 'Validation strategy improperly initialized. Refer to documentation of the provided strategy.');
  return {
    getValidationMessages: function(errors = {}, key) {
      if (isEmpty(errors)) {
        return [];
      }
      if (key === undefined) {
        return flatten(Object.keys(errors).map(function(error) {
          return errors[error].map(he.decode) || [];
        }));
      }
      return errors[key] ? errors[key].map(he.decode) : [];
    },
    isValid: function(errors, key) {
      return isEmpty(this.getValidationMessages(errors, key));
    },
    ..._strategy,
  };
}
