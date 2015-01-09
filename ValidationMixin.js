
"use strict";

var ValidatorFactory = require('./ValidatorFactory');

var ValidationMixin = {
  validate: function() {
    var validatorTypes = this.validatorTypes;
    if (typeof this.validatorTypes === 'function') {
      validatorTypes = this.validatorTypes();
    }
    return ValidatorFactory.validate(validatorTypes, this.state);
  },
  isValid: function(field) {
    return ValidatorFactory.isValid(this.validate(), field);
  }
};

module.exports = ValidationMixin;
