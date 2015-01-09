
module.exports = {
  validate: function(config, state) {
    if (config && state) {
      return Object.keys(config).reduce(function(validationMemo, key) {
        var value = state[key];
        var strategies = [];
        if (Array.isArray(config[key])) {
          strategies = config[key];
        } else {
          strategies.push(config[key]);
        }
        validationMemo[key] = strategies.reduce(function(memo, Strategy) {
          var result = Strategy(value);
          if (result) {
            memo.push(result);
          }
          return memo;
        }, []);
        return validationMemo;
      }, {});
    }
    throw new Error('config or state undefined');
  },
  isValid: function(validations, key) {
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
};
