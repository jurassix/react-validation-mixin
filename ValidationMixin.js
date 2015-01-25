"use strict";

var assign = Object.assign || require('object.assign');
var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {

  /**
   * Validate single form field against the components state. If no field
   * is provided, validate entire form.
   *
   * @param {?string} state field name to validate
   * @return {object} newly updated errors object keyed on state field
   * names. Missing key or undefined value indicates no error.
   */
  validate: function(field) {
    var validatorTypes = this.validatorTypes || {};
    if (typeof this.validatorTypes === 'function') {
      validatorTypes = this.validatorTypes();
    }
    var options = {
      schema: validatorTypes,
      state: this.state,
      field: field
    };
    var nextErrors = assign({}, this.state.errors, ValidationFactory.validate(options));
    this.setState({
      errors: nextErrors
    });
    return nextErrors;
  },

  /**
   * Convenience method to validate a field via an event handler. Useful for
   * onBlur, onClick, onChange, etc...
   *
   * @param {?string} state field name to validate
   * @param {?boolean} flag to indicate that this event should be canceled.
   * default is false.
   * @return {function} validation event handler
   */
  handleValidation: function(field, preventDefault) {
    return function(event) {
      if (preventDefault === true) {
        event.preventDefault();
      }
      this.validate(field);
    }.bind(this);
  },

  /**
   * Returns all validation messages for a single field, or all fields if
   * no field is provided.
   *
   * @param {?string} state field name to validate
   * @return {array} all validation messages
   */
  getValidationMessages: function(field) {
    return ValidationFactory.getValidationMessages(this.state.errors, field);
  },

  /**
   * Determines if the current components state is valid. This method is lazy
   * if a field is specified. This allows developers to check if errors have
   * been reported for this field without forcing a revalidation. If no field
   * is provided the entire form will be forcefully revalidated.
   *
   * @param {?string} state field name to validate
   * @return {boolean} returns validity of single field or entire form
   */
  isValid: function(field) {
    if (field) {
      //validate single field only; lazy validation
      return ValidationFactory.isValid(this.state.errors, field);
    } else {
      //force full form validation if no field is provided
      return ValidationFactory.isValid(this.validate(), field);
    }
  }

};

module.exports = ValidationMixin;
