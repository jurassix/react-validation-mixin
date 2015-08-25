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

  validateSingleField(joiSchema, data, key) {
    joiSchema = joiSchema || {};
    data = data || {};
    var joiOptions = {abortEarly: false, allowUnknown: true},
      newData = {},
      newSchema = {},
      errors;
    newData[key] = data[key];
    newSchema[key] = joiSchema[key];
    if (joiSchema[key]._refs.length > 0) {
      joiSchema[key]._refs.map(function (i) {
        newSchema[i] = joiSchema[i];
        newData[i] = data[i];
      });
    }
    errors = this._format(Joi.validate(newData, newSchema, joiOptions));
    var result = {};
    result[key] = errors[key];
    return result;
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
