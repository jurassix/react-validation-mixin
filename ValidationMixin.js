'use strict';

require('object.assign').shim();
var result = require('lodash.result');
var merge = require('lodash.merge');
var isObject = require('lodash.isobject');
var isArray = require('lodash.isarray');
var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {
  /**
   * Check for sane configurations
   */
  componentDidMount: function() {
    if (this.validatorTypes !== undefined &&
      typeof this.validatorTypes !== 'function' &&
      !isObject(this.validatorTypes)) {
      throw Error('invalid `validatorTypes` type');
    }
    if (this.validatorData !== undefined &&
      typeof this.validatorData !== 'function' &&
      !isObject(this.validatorData)) {
      throw Error('invalid `validatorData` type');
    }
  },

  /**
   * Validate single form key or entire form against the component's state.
   *
   * @param {?String} key to validate (entire form validation if undefined).
   * @return {Object} newly updated errors object keyed on state field
   * names.
   */
  validate: function(key) {
    var schema = result(this, 'validatorTypes') || {};
    var data = result(this, 'validatorData') || this.state;
    var nextErrors = merge({}, this.state.errors, ValidationFactory.validate(schema, data, key), function(a, b) {
      return isArray(b) ? b : undefined;
    });
    this.setState({
      errors: nextErrors
    });
    return nextErrors;
  },

  /**
   * Convenience method to validate a key via an event handler. Useful for
   * onBlur, onClick, onChange, etc...
   *
   * Usage: <input onBlur={this.handleUnfocusFor('password')} .../>
   *
   * @param {?String} key to validate
   * default is false.
   * @return {function} validation event handler
   */
  handleUnfocusFor: function(key) {
    return function handleUnfocus(event) {
      event.preventDefault();
      this.validate(key);
    }.bind(this);
  },

  /**
   * Convenience method to validate a whole form on submit
   *
   * Usage: <form onSubmit={this.handleSubmit}>...</form>
   */
  handleSubmit: function(event) {
    event.preventDefault();
    this.validate();
  },

  /**
   * Convenience method to reset a form to initial state
   *
   * Usage: <button onClick={this.handleReset}>Reset</button>
   */
  handleReset: function(event) {
    event.preventDefault();
    this.setState(this.getInitialState());
  },

  /**
   * Get current validation messages for a specified key or entire form.
   *
   * @param {?String} key to get messages (entire form if undefined)
   * @return {Array}
   */
  getValidationMessages: function(key) {
    return ValidationFactory.getValidationMessages(this.state.errors, key);
  },

  /**
   * Check current validity for a specified key or entire form.
   *
   * @param {?String} key to check validity (entire form if undefined).
   * @return {Boolean}.
   */
  isValid: function(key) {
    return ValidationFactory.isValid(this.state.errors, key);
  }
};

module.exports = ValidationMixin;
