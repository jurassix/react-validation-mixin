'use strict';

require('object.assign').shim();
var result = require('lodash.result');
var isEmpty = require('lodash.isempty');
var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {

  /**
   * Check for sane configurations
   */
  componentDidMount: function() {
    if (this.validatorTypes !== undefined &&
      typeof this.validatorTypes !== 'function') {
      throw Error('invalid `validatorTypes` type');
    }
    if (this.getValidatorData !== undefined &&
      typeof this.getValidatorData !== 'function') {
      throw Error('invalid `getValidatorData` type');
    }
  },

  /**
   * Wrapper method to validate entire form against the component data.
   *
   * @param {?String} key to validate, or entire form validation if key is undefined.
   * @param {?Function} error-first callback containing the validation errors if any.
   */
  validate: function(callback) {
    this._invokeCallback(this._validate(), callback);
  },

  /**
   * Wrapper method to validate single form key against the component data.
   *
   * @param {?String} key to validate, or entire form validation if key is undefined.
   * @param {?Function} error-first callback containing the validation errors if any.
   */
  validateKey: function(key, callback) {
    this._invokeCallback(this._validate(key), callback);
  },


  /**
   * Convenience method to validate a key via an event handler. Useful for
   * onBlur, onClick, onChange, etc...
   *
   * @param {?String} State key to validate
   * @return {function} validation event handler
   */
  handleValidation: function(key) {
    return function(event) {
      event.preventDefault();
      this.validateKey(key);
    }.bind(this);
  },

  /**
   * Get current validation messages for a specified key or entire form.
   *
   * @param {?String} key to get messages, or entire form if key is undefined.
   * @return {Array}
   */
  getValidationMessages: function(key) {
    return ValidationFactory.getValidationMessages(this.state.errors, key);
  },

  /**
   * Clear all previous validations
   *
   * @return {void}
   */
  clearValidations: function() {
    return this.setState({
      errors: {}
    });
  },

  /**
   * Check current validity for a specified key or entire form.
   *
   * @param {?String} key to check validity (entire form if undefined).
   * @return {Boolean}.
   */
  isValid: function(key) {
    return ValidationFactory.isValid(this.state.errors, key);
  },

  /**
   * Private method that handles executing users callback
   *
   * @param {Object} errors object keyed on data field names.
   * @param {Function} error-first callback containing the validation errors if any.
   */
  _invokeCallback: function(errors, callback) {
    if (typeof callback === 'function') {
      if (isEmpty(errors)) {
        return callback();
      } else {
        return callback(errors);
      }
    }
  },

  /**
   * Private method to validate single form key or entire form against the component data.
   *
   * @param {?String} key to validate, or entire form validation if key is undefined.
   * @return {Object} errors object keyed on data field names.
   */
  _validate: function(key) {
    var schema = result(this, 'validatorTypes') || {};
    var data = result(this, 'getValidatorData') || this.state;
    var nextErrors = Object.assign({}, this.state.errors, ValidationFactory.validate(schema, data, key));
    this.setState({
      errors: nextErrors
    });
    return nextErrors;
  },
};

module.exports = ValidationMixin;
