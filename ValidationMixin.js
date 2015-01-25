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
    return nextErrors;
  },

  handleValidation: function(field) {
    return function() {
      this.validate(field);
    }.bind(this);
  },

  getValidationMessages: function(field) {
    return ValidationFactory.getValidationMessages(this.state.errors, field);
  },

  isValid: function(field) {
    if (field) {
      //validate single field only
      return ValidationFactory.isValid(this.state.errors, field);
    } else {
      //force full form validation if no field is provided
      return ValidationFactory.isValid(this.validate(), field);
    }
  }

};

module.exports = ValidationMixin;
