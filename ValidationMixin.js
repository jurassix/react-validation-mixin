
"use strict";

var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {
  validate: function() {
    var validatorTypes = this.validatorTypes;
    if (typeof this.validatorTypes === 'function') {
      validatorTypes = this.validatorTypes();
    }
    return ValidationFactory.validate(validatorTypes, this.state);
  },
  getMessages: function(field) {
    return ValidationFactory.getMessages(this.validate(), field);
  },
  isValid: function(field) {
    return ValidationFactory.isValid(this.validate(), field);
  }
};

module.exports = ValidationMixin;
