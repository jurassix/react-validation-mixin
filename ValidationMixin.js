"use strict";

var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {

  componentWillUpdate: function(nextProps, nextState) {
    this.clearValidations()
  },

  clearValidations: function() {
    this.__cachedValidationResults = null;
  },

  validate: function(field) {
    var validatorTypes = this.validatorTypes || {};
    if (typeof this.validatorTypes === 'function') {
      validatorTypes = this.validatorTypes();
    }
    var options = {
      schema: validatorTypes,
      state: this.state,
      field: field
    };
    return ValidationFactory.validate(options);
  },

  getValidationMessages: function(field) {
    return ValidationFactory.getValidationMessages(this.validate(field), field);
  },

  isValid: function(field) {
    return ValidationFactory.isValid(this.validate(field), field);
  }
};

module.exports = ValidationMixin;
