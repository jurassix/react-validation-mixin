require('object.assign').shim();
var isEmpty = require('lodash.isempty');
var flatten = require('lodash.flatten');
var ValidationStrategy = require('./JoiValidationStrategy');
var he = require('he');

var ValidationFactory = Object.assign({
  getValidationMessages: function(errors, key) {
    errors = errors || {};
    if (isEmpty(errors)) {
      return [];
    } else {
      if (key === undefined) {
        return flatten(Object.keys(errors).map(function(error) {
          return errors[error] || [];
        }));
      } else {
        return errors[key] ? errors[key].map(he.decode) : [];
      }
    }
  },

  isValid: function(errors, key) {
    return isEmpty(this.getValidationMessages(errors, key));
  },

}, ValidationStrategy);

module.exports = ValidationFactory;
