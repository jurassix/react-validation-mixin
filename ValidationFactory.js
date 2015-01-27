require('object.assign').shim();
var isEmpty = require('lodash.isempty');
var flatten = require('lodash.flatten');
var ValidationStrategy = require('./JoiValidationStrategy');

var ValidationFactory = Object.assign({
  getValidationMessages: function(errors, key) {
    errors = errors || {};
    if (isEmpty(errors)) {
      return [];
    } else {
      if (key) {
        return errors[key] || [];
      } else {
        return flatten(Object.keys(errors).map(function(key) { return errors[key] || []; }));
      }
    }
  },

  isValid: function(errors, key) {
    return isEmpty(this.getValidationMessages(errors, key));
  },
}, ValidationStrategy);

module.exports = ValidationFactory;
