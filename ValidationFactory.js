require('object.assign').shim();
var Lens = require('data.lens');
var isObject = require('lodash.isobject');
var isPlainObject = require('lodash.isplainobject');
var isEmpty = require('lodash.isempty');
var flatten = require('lodash.flatten');
var ValidationStrategy = require('./JoiValidationStrategy');

function uberFlatten(obj) {
  return flatten(Object.keys(obj).map(function(key) {
    return isPlainObject(obj[key]) ? uberFlatten(obj[key]) : obj[key] || [];
  }));
}

var ValidationFactory = Object.assign({
  getValidationMessages: function(errors, key) {
    errors = errors || {};
    if (key === undefined) {
      return uberFlatten(errors);
    } else {
      var lens = Lens(key);
      try {
        return lens.get(errors) || [];
      } catch (err) {
        if (err instanceof TypeError) {
          return [];
        } else {
          throw err;
        }
      }
    }
  },

  isValid: function(errors, key) {
    return isEmpty(this.getValidationMessages(errors, key));
  },

}, ValidationStrategy);

module.exports = ValidationFactory;
