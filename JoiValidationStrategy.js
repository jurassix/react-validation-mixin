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

var joiValidation = function(state, schema) {
  return Joi.validate(state, schema, {
    abortEarly: false,
    allowUnknown: true,
  });
};

var JoiValidationStrategy = {

  validate: function(options) {
    if (options && options.schema) {
      var errors = formatErrors(joiValidation(options.state || {}, options.schema));
      if (options.field) {
        var result = {};
        result[options.field] = errors[options.field];
        return result;
      } else {
        return errors;
      }

    }
    throw new Error('schema is undefined');
  }

};

module.exports = JoiValidationStrategy;
