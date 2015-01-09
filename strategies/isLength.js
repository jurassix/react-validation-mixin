
var isLength = function(length) {
  function validation(value) {
    if (!value || value.trim() === '' || value.length !== length) {
      return 'Value must be ' + length + ' characters long';
    }
  }
  if (length) {
    return validation;
  }
  throw new Error('isLength strategy requires an initial length');
}

module.exports = isLength;
