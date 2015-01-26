var Ld = require("lodash");
var assign = Object.assign || require('object.assign');
var ValidationStrategy = require('./JoiValidationStrategy');

var ValidationFactory = assign({

  isValid: function(validations, key) {
    if (Ld.isEmpty(validations)) {
      return true;
    } else {
      return key ? Ld.isEmpty(validations[key]) : Ld.isEmpty(validations);
    }
  },

  getValidationMessages: function(validations, key) {
    if (Ld.isEmpty(validations)) {
      return [];
    } else {
      if (key) {
        return validations[key] || [];
      } else {
        return Ld.flatten(Object.keys(validations).map(function(key) { return validations[key] || []; }));
      }
    }
  }

}, ValidationStrategy);

module.exports = ValidationFactory;
