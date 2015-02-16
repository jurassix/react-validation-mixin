var isPlainObject = require('lodash.isplainobject');

exports.flattenAndResetTo = function flattenAndResetTo(obj, to, path) {
  path = path || '';
  return Object.keys(obj).reduce(function(memo, key) {
    if (isPlainObject(obj[key])) {
      Object.assign(memo, flattenAndResetTo(obj[key], to, path + key+ '.'));
    } else {
      memo[path + key] = to;
    }
    return memo;
  }, {});
};
