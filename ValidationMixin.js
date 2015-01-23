
"use strict";

var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {
  autoLabel: [],

  validate: function() {
    var validatorTypes = this.validatorTypes || {};
    if (typeof this.validatorTypes === 'function') {
      validatorTypes = this.validatorTypes();
    }

    // Call `.label` method on values of `validatorTypes` to make error messages human readable
    var autoLabel = [];
    if (Array.isArray(this.autoLabel)) {
      autoLabel = this.autoLabel;
    }
    else if (this.autoLabel === true) {
      autoLabel = Object.keys(validatorTypes);
    }
    if (autoLabel.length) {
      autoLabel.forEach(function(key) {
        validatorTypes[key] = validatorTypes[key].label(this.refs[key].props.label);
      }.bind(this));
    }

    return ValidationFactory.validate(validatorTypes, this.state);
  },

  getValidationMessages: function(field) {
    return ValidationFactory.getValidationMessages(this.validate(), field);
  },

  isValid: function(field) {
    return ValidationFactory.isValid(this.validate(), field);
  }
};

module.exports = ValidationMixin;
