'use strict';

require('object.assign').shim();
var result = require('lodash.result');
var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {
  /**
   * Check for sane configurations
   */
  componentDidMount: function() {
    if (typeof this.validatorTypes !== 'function' && !Array.isArray(this.validatorTypes)) {
      throw Error('invalid `validatorTypes` type');
    }
  },

  /**
   * Validate single form field or entire form against the component's state.
   *
   * @param {?String} key. Field key to validate (entire form if undefined).
   * @return {Boolean} Result of `isValid` call after validation.
   */
  validate: function(key) {
    var schema = result(this, 'validatorTypes', {});
    var errors = Object.assign({}, this.state.errors, ValidationFactory.validate(this.state, schema, key));
    this.setState({
      errors: errors
    });
    return this.isValid(key);
  },

  /**
   * Get current validation messages for a specified field or entire form.
   *
   * @param {?String} key. Field key to get messages (entire form if undefined)
   * @return {Array}
   */
  getValidationMessages: function(key) {
    return ValidationFactory.getValidationMessages(this.state.errors, key);
  },

  /**
   * Check current validity for a specified field or entire form.
   *
   * @param {?String} key. Field key to check validity (entire form if undefined).
   * @return {Boolean}.
   */
  isValid: function(key) {
    return ValidationFactory.isValid(this.state.errors, key);
  }
};

module.exports = ValidationMixin;
