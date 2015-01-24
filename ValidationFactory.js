var validationStrategy = require('./JoiValidationStrategy');

var ValidationFactory = {

  validate: validationStrategy.validate,

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
