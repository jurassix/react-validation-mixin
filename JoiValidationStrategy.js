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
      options.state = options.state || {};
      if (options.field) {
        var _schema = {};
        var _state = {};
        _schema[options.field] = options.schema[options.field];
        _state[options.field] = options.state[options.field];
        return formatErrors(joiValidation(_state, _schema))
      } else {
        return formatErrors(joiValidation(options.state, options.schema))
      }
    }
    throw new Error('schema is undefined');
  }

};

module.exports = JoiValidationStrategy;
