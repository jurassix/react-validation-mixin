
var isRequired = function(value) {
  var error = {};
  if (!value || value.trim() === '') {
    return 'Value is Required';
  }
}

module.exports = isRequired;
