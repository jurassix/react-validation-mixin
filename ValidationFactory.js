var Joi = require('joi');

var formatErrors = function(result) {
  if (result.error !== null) {
    return result.error.details.reduce(function(memo, detail) {
      if (!Array.isArray(memo[detail.path])) {
        memo[detail.path] = [];
      }
      memo[detail.path].push(detail.message);
      return memo;
    }, {});
  } else {
    return {};
  }
};

module.exports = {
  validate: function(schema, state) {
    if (schema && state) {
      return formatErrors(Joi.validate(state, schema, {abortEarly: false}));
    }
    throw new Error('schema or state undefined');
  },
  isValid: function(validations, key) {
    if (validations) {
      if (key) {
        var errors = validations[key] || [];
        if (errors.length === 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return Object.keys(validations).reduce(function(memo, key) {
          var errors = validations[key] || [];
          if (errors.length !== 0) {
            memo = false;
          }
          return memo;
        }, true);
      }
    }
    throw new Error('validations is undefined');
  },
  getValidationMessages: function(validations, key) {
    if (validations) {
      return validations[key] || [];
    }
    throw new Error('validations is undefined');
  }
};
