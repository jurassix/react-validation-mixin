var Joi = require('joi');
var union = require('lodash.union');
var flattenAndResetTo = require('./helpers').flattenAndResetTo;

var JoiValidationStrategy = {
  validate: function(joiSchema, data, key) {
    joiSchema = joiSchema || {};
    data = data || {};
    var joiOptions = {
      abortEarly: false,
      allowUnknown: true,
    };
    var errors = this.formatErrors(Joi.validate(data, joiSchema, joiOptions));
    if (key === undefined) {
      return Object.assign(
        flattenAndResetTo(joiSchema, []),
        errors
      );
    } else {
      var result = {};
      result[key] = errors[key] || [];
      return result;
    }
  },

  formatErrors: function(joiResult) {
    if (joiResult.error !== null) {
      return joiResult.error.details.reduce(function(memo, detail) {
        if (!Array.isArray(memo[detail.path])) {
          memo[detail.path] = [];
        }
        memo[detail.path].push(detail.message);
        return memo;
      }, {});
    } else {
      return {};
    }
  }
};

module.exports = JoiValidationStrategy;
