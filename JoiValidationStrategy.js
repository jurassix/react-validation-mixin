var Joi = require('joi');
var union = require('lodash.union');

var JoiValidationStrategy = {
  validate: function(joiSchema, data, key) {
    joiSchema = joiSchema || {};
    data = data || {};
    var joiOptions = {
      abortEarly: false,
      allowUnknown: true,
    };
    var errors = this._format(Joi.validate(data, joiSchema, joiOptions));
    if (key === undefined) {
      union(Object.keys(joiSchema), Object.keys(data)).forEach(function(error) {
        errors[error] = errors[error] || [];
      });
      return errors;
    } else {
      var result = {};
      result[key] = errors[key];
      return result;
    }
  },

  _format: function(joiResult) {
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
