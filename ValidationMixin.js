'use strict';

require('object.assign').shim();
var result = require('lodash.result');
var isObject = require('lodash.isObject');
var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {

  /**
   * Check for sane configurations
   */
  componentDidMount: function() {
    if (this.validatorTypes !== undefined &&
      typeof this.validatorTypes !== 'function' &&
      !isObject(this.validatorTypes)) {
      throw Error('invalid `validatorTypes` type');
    }
    if (this.validatorData !== undefined &&
      typeof this.validatorData !== 'function' &&
      !isObject(this.validatorData)) {
      throw Error('invalid `validatorData` type');
    }
  },

  /**
   * Validate single form key or entire form against the component's state.
   *
   * @param {?String} key to validate (entire form validation if undefined).
   * @return {Boolean} newly updated errors object keyed on state field
   * names.
   */
  validate: function(key) {
    var schema = result(this, 'validatorTypes') || {};
    var data = result(this, 'validatorData') || this.state;
    var nextErrors = Object.assign({}, this.state.errors, ValidationFactory.validate(schema, data, key));
    this.setState({
      errors: nextErrors
    });
    return nextErrors;
  },

  /**
   * Convenience method to validate a key via an event handler. Useful for
   * onBlur, onClick, onChange, etc...
   *
   * @param {?String} State key to validate
   * default is false.
   * @return {function} validation event handler
   */
  handleValidation: function(key) {
    return function(event) {
      event.preventDefault();
      this.validate(key);
    }.bind(this);
  },

  /**
   * Get current validation messages for a specified key or entire form.
   *
   * @param {?String} key to get messages (entire form if undefined)
   * @return {Array}
   */
  getValidationMessages: function(key) {
    return ValidationFactory.getValidationMessages(this.state.errors, key);
  },

  /**
   * Check current validity for a specified key or entire form.
   *
   * @param {?String} key to check validity (entire form if undefined).
   * @return {Boolean}.
   */
  isValid: function(key) {
    var errors = this.state.errors;
    if (key === undefined) {
      errors = this.validate();
    }
    return ValidationFactory.isValid(errors, key);
  }
};

module.exports = ValidationMixin;
