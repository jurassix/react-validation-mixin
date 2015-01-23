"use strict";

var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {

  componentWillUpdate: function(nextProps, nextState) {
    this.clearValidations()
  },

  clearValidations: function () {
    this.__cachedValidationResults = null;
  },

  validate: function(field) {
    if (!this.__cachedValidationResults) {
      var validatorTypes = this.validatorTypes || {};
      if (typeof this.validatorTypes === 'function') {
        validatorTypes = this.validatorTypes();
      }
      var options = {
        validations: validatorTypes,
        state: this.state,
        field: field
      };
      this.__cachedValidationResults = ValidationFactory.validate(options);
    }
    return this.__cachedValidationResults || {};
  },

  getValidationMessages: function(field) {
    return ValidationFactory.getValidationMessages(this.validate(field), field);
  },

  isValid: function(field) {
    return ValidationFactory.isValid(this.validate(field), field);
  }
};

module.exports = ValidationMixin;
