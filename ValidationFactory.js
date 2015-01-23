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

var ValidationFactory = {
  validate: function(options) {
    options = options || {};
    if (options.schema) {
      return formatErrors(Joi.validate(options.state || {}, options.schema, {
        abortEarly: false,
        allowUnknown: true,
      }));
    }
    throw new Error('validationTypes schema is undefined');
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
      if (key) {
        return validations[key] || [];
      } else {
        return Object.keys(validations).reduce(function(memo, key) {
          var messages = validations[key] || [];
          if (messages.length !== 0) {
            memo = memo.concat(messages);
          }
          return memo;
        }, []);
      }
    }
    throw new Error('validations is undefined');
  }
};

module.exports = ValidationFactory;
