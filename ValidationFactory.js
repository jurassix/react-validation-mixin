require('object.assign').shim();
var isEmpty = require("lodash.isempty");
var flatten = require("lodash.flatten");
var ValidationStrategy = require('./JoiValidationStrategy');

var ValidationFactory = Object.assign({
  isValid: function(validations, key) {
    if (isEmpty(validations)) {
      return true;
    } else {
      return key ? isEmpty(validations[key]) : isEmpty(validations);
    }
  },

  getValidationMessages: function(validations, key) {
    if (isEmpty(validations)) {
      return [];
    } else {
      if (key) {
        return validations[key] || [];
      } else {
        return flatten(Object.keys(validations).map(function(key) { return validations[key] || []; }));
      }
    }
  }
}, ValidationStrategy);

module.exports = ValidationFactory;
