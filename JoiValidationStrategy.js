var Lens = require("data.lens");
var Joi = require('joi');
var union = require('lodash.union');
var isPlainObject = require("lodash.isplainobject");

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
        this.resetErrors(joiSchema),
        this.resetErrors(data),
        errors
      );
    } else {
      var result = {};
      result[key] = errors[key];
      return result;
    }
  },

  resetErrors: function(data) {
    return Object.keys(data).reduce(function(memo, key) {
      var val = data[key];
      memo[key] = isPlainObject(val) ? this.resetErrors(val) : []; // TODO immutable-js support?!
      return memo;
    }.bind(this), {});
  },

  formatErrors: function(joiResult) {
    if (joiResult.error !== null) {
      return joiResult.error.details.reduce(function (memo, detail) {
        var lens = Lens(detail.path);
        var newMemo = memo;
        try {
          if (!lens.get(memo)) {
            // Last path fragment is missing
            newMemo = lens.set([], memo);
          }
        } catch (err) {
          if (err instanceof TypeError) {
            // Butlast path fragment is missing
            newMemo = lens.set([], memo);
          } else {
            throw err;
          }
        }
        return lens.set(lens.get(newMemo).concat([detail.message]), newMemo);
      }, {});
    } else {
      return {};
    }
  }
};

module.exports = JoiValidationStrategy;
