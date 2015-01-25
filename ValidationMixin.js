"use strict";

var assign = Object.assign || require('object.assign');
var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {

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
    var nextErrors = assign({}, this.state.errors, ValidationFactory.validate(options));
    this.setState({
      errors: nextErrors
    });
  },

  getValidationMessages: function(field) {
    return ValidationFactory.getValidationMessages(field);
  },

  isValid: function(field) {
    return ValidationFactory.isValid(field);
  }

};

module.exports = ValidationMixin;
