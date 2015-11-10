import React from 'react';
import invariant from 'invariant';
import result from 'lodash.result';
import factory from '../validationFactory';
import getDisplayName from 'react-display-name';
import {defined} from '../utils';

export default function(strategy) {
  const validator = factory(strategy);
  return function(WrappedComponent) {
    invariant(defined(WrappedComponent), 'Component was not provided to the Validator. Export you Component with "export default validator(strategy)(Component);"');
    class Validation extends React.Component {

      constructor(props, context) {
        super(props, context);
        this.render = this.render.bind(this);
        this.validate = this.validate.bind(this);
        this.isValid = this.isValid.bind(this);
        this.getValidationMessages = this.getValidationMessages.bind(this);
        this.clearValidations = this.clearValidations.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this._invokeCallback = this._invokeCallback.bind(this);

        this.state = { errors: {} };
      }

      /* Get current validation messages for a specified key or entire form.
       *
       * @param {?String} key to get messages, or entire form if key is undefined.
       * @return {Array}
       */
      getValidationMessages(key) {
        return validator.getValidationMessages(this.state.errors, key) || [];
      }

      /* Convenience method to validate a key via an event handler. Useful for
       * onBlur, onClick, onChange, etc...
       *
       * @param {?String} State key to validate
       * @param {?Function} callback containing validation errors.
       * @param {?Object} component to validate.
       * @return {function} validation event handler
       */
      handleValidation(key, callback, component) {
        return () => {
          this.validate(key, callback, component);
        };
      }

      /* Method to validate single form key or entire form against the component data.
       *
       * @param {String|Function} key to validate, or error-first containing the validation errors if any.
       * @param {?Function} error-first callback containing the validation errors if any.
       * @param {?Object} component containing getValidatorData function.
       */
      validate(/* [key], callback, component */) {
        const fallback = arguments.length <= 1 && typeof arguments[0] === 'function' ? arguments[0] : undefined;
        const key = arguments.length <= 1 && typeof arguments[0] === 'function' ? undefined : arguments[0];
        const callback = arguments.length <= 2 && typeof arguments[1] === 'function' ? arguments[1] : fallback;

        if (arguments[2]) this.refs.component = arguments[2];

        const data = result(this.refs.component, 'getValidatorData');
        const schema = result(this.refs.component, 'validatorTypes');

        invariant(defined(data), 'Data was not provided to the Validator. Implement "getValidatorData" to return data.');
        invariant(defined(schema), 'A schema was not provided to the Validator. Implement "validatorTypes" to return a validation schema.');

        const options = {
          key,
          prevErrors: this.state.errors,
        };
        validator.validate(data, schema, options, nextErrors => {
          this.setState({ errors: { ...nextErrors } }, this._invokeCallback.bind(this, key, callback));
        });
      }

      /* Clear all previous validations
       *
       * @return {void}
       */
      clearValidations(callback) {
        return this.setState({
          errors: {},
        }, callback);
      }

      /* Check current validity for a specified key or entire form.
       *
       * @param {?String} key to check validity (entire form if undefined).
       * @return {Boolean}.
       */
      isValid(key) {
        return validator.isValid(this.state.errors, key);
      }

      /* Private method that handles executing users callback on validation
       *
       * @param {Object} errors object keyed on data field names.
       * @param {Function} error-first callback containing the validation errors if any.
       */
      _invokeCallback(key, callback) {
        if (typeof callback !== 'function') {
          return;
        }
        if (this.isValid(key)) {
          callback();
        } else {
          callback(this.state.errors);
        }
      }

      render() {
        return (
          <WrappedComponent
            ref="component"
            errors={this.state.errors}
            validate={this.validate}
            isValid={this.isValid}
            getValidationMessages={this.getValidationMessages}
            clearValidations={this.clearValidations}
            handleValidation={this.handleValidation}
            {...this.props}
          >
            {this.props.children}
          </WrappedComponent>
        );
      }
    }
    Validation.displayName = `Validation(${getDisplayName(WrappedComponent)})`;
    Validation.propTypes = {
      children: React.PropTypes.array,
    };
    return Validation;
  };
}
