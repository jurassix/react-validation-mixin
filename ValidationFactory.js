require('object.assign').shim();
var isEmpty = require("lodash.isempty");
var flatten = require("lodash.flatten");
var ValidationStrategy = require('./JoiValidationStrategy');

var ValidationFactory = Object.assign({
  isValid: function(errors, key) {
    if (isEmpty(errors)) {
      return true;
    } else {
      return key ? isEmpty(errors[key]) : isEmpty(errors);
    }
  },

  getValidationMessages: function(errors, key) {
    if (isEmpty(errors)) {
      return [];
    } else {
      if (key) {
        return errors[key] || [];
      } else {
        return flatten(Object.keys(errors).map(function(key) { return errors[key] || []; }));
      }
    }
  }
}, ValidationStrategy);

module.exports = ValidationFactory;
