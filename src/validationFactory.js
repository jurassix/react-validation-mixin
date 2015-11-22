import invariant from 'invariant';
import isEmpty from 'lodash.isempty';
import get from 'lodash.get';
import { defined, flattenErrorsObject } from './utils';

export default function validationFactory(strategy) {
  const _strategy = typeof strategy === 'function' ? strategy() : strategy;
  invariant(defined(_strategy), 'Validation strategy not provided. A user provided strategy is expected.');
  invariant(typeof _strategy !== 'function', 'Validation strategy improperly initialized. Refer to documentation of the provided strategy.');
  return {

    getValidationMessages(errors = {}, key) {
      if (isEmpty(errors)) {
        return [];
      }
      if (key === undefined) {
        return flattenErrorsObject(errors);
      }
      return get(errors, key);
    },

    isValid(errors, key) {
      if (!defined(key)) return isEmpty(errors);
      return isEmpty(get(errors, key));
    },

    ..._strategy,

  };
}
