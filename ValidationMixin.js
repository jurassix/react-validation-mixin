"use strict";

var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {

  componentWillUpdate: function(nextProps, nextState) {
    this.clearValidations()
  },

  clearValidations: function () {
    this.__cachedValidationResults = null;
  },

  validate: function() {
    if (!this.__cachedValidationResults) {
      var validatorTypes = this.validatorTypes || {};
      if (typeof this.validatorTypes === 'function') {
        validatorTypes = this.validatorTypes();
      }
      this.__cachedValidationResults = ValidationFactory.validate(validatorTypes, this.state);
    }
    return this.__cachedValidationResults || {};
  },

  getValidationMessages: function(field) {
    return ValidationFactory.getValidationMessages(this.validate(), field);
  },

  isValid: function(field) {
    return ValidationFactory.isValid(this.validate(), field);
  }
};

module.exports = ValidationMixin;
