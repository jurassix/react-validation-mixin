var Joi = require('joi');

var JoiValidationStrategy = {
  validate: function(joiSchema, data, key) {
    joiSchema = joiSchema || {};
    data = data || {};
    var joiOptions = {
      abortEarly: false,
      allowUnknown: true,
    };

    var errors = this.format(Joi.validate(data, joiSchema, joiOptions));
    if (key === undefined) {
      Object.keys(joiSchema).forEach(function(key) {
        errors[key] = errors[key] || [];
      });
      Object.keys(data).forEach(function(key) {
        errors[key] = errors[key] || [];
      });
      return errors;
    } else {
      return errors[key] || [];
    }
  },

  format: function(joiResult) {
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
