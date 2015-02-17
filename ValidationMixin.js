'use strict';

require('object.assign').shim();
var result = require('lodash.result');
var isEmpty = require('lodash.isempty');
var isObject = require('lodash.isobject');
var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {
  /**
   * Check for sane configurations
   */
  componentDidMount: function() {
    if (this.validatorTypes !== undefined && !isObject(this.validatorTypes)) {
      throw Error('invalid `validatorTypes` type');
    }
    if (this.getValidatorData !== undefined && !isObject(this.getValidatorData)) {
      throw Error('invalid `getValidatorData` type');
    }
  },

  /**
   * Method to validate single form key or entire form against the component data.
   *
   * @param {String|Function} key to validate, or error-first containing the validation errors if any.
   * @param {?Function} error-first callback containing the validation errors if any.
   */
  validate: function(key, callback) {
    if (typeof key === 'function') {
      callback = key;
      key = undefined;
    }
    var schema = result(this, 'validatorTypes') || {};
    var data = result(this, 'getValidatorData') || this.state;
    var validationErrors = Object.assign({}, this.state.errors, ValidationFactory.validate(schema, data, key));
    this.setState({
      errors: validationErrors
    }, this._invokeCallback.bind(this, key, callback));
  },

  /**
   * Convenience method to validate a key via an event handler. Useful for
   * onBlur, onClick, onChange, etc...
   *
   * @param {?String} State key to validate
   * @return {function} validation event handler
   */
  handleValidation: function(key, callback) {
    return function(event) {
      event.preventDefault();
      this.validate(key, callback);
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
   * Private method that handles executing users callback on validation
   *
   * @param {Object} errors object keyed on data field names.
   * @param {Function} error-first callback containing the validation errors if any.
   */
  _invokeCallback: function(key, callback) {
    if (typeof callback !== 'function') {
      return;
    }
    if (this.isValid(key)) {
      callback(null, this.state.errors);
    } else {
      callback(new Error('Validation errors exist'), this.state.errors);
    }
  }

};

module.exports = ValidationMixin;
