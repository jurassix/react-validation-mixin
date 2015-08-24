var Joi = require('joi');
var union = require('lodash.union');
require('object.assign').shim();

var JoiValidationStrategy = {
  validate: function(joiSchema, data, key, _joiOptions) {
    joiSchema = joiSchema || {};
    data = data || {};
    var joiOptions = Object.assign({
      abortEarly: false,
      allowUnknown: true,
    }, _joiOptions);
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
