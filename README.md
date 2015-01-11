# react-validation-mixin
Simple validation mixin for React using [Joi](https://github.com/hapijs/joi).

This Mixin provides the boilerplate needed to validate your React components state. Simply define the object schema of your state using Joi validators and the mixin will give you access to each fields validity and error messages.

# Install

Install mixin via npm:

    > npm install --save react-validation-mixin

Make sure you install the peer dependency Joi:

    > npm install --save joi

_See [Joi](https://github.com/hapijs/joi) for a full list of api validation strategies available._

# Usage

Add the mixin to your React Component:

    mixins: [ValidationMixin]

### `validatorTypes`

validatorTypes is the object schema defining the validity of your components state. _You do not have to provide validation for all state fields._ Each validator is defined using [Joi](https://github.com/hapijs/joi). validatorTypes can be defined as an object or function, as long as a valid Joi schema is returned.

    // defined as object
    validatorTypes: {
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
    }

    // defined as function
    validatorTypes: function() {
      return Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
      });
    }

### `isValid([fieldName])`

returns true|false depending of the validity of the current state.

    this.isValid('username'); // returns boolean for validity of only this field

    this.isValid(); // returns boolean for validity of all fields in schema

### `getValidationMessages([fieldName])`

returns an array validation messages for this field.

    this.getValidationMessages('username'); // returns array of messages for this field or empty array if valid

    this.getValidationMessages(); // returns array of messages for all fields or empty array if valid

# Example Component:

    var React = require('react/addons');
    var ValidationMixin = require('react-validation-mixin');
    var Joi = require('joi');
    var UserAction = require('../actions/UserAction');

    var Signup = React.createClass({
      displayName: 'Signup',
      mixins: [ValidationMixin, React.addons.LinkedStateMixin],
      validatorTypes: {
        firstName: Joi.string().required(),
        lastName: Joi.string().allow(null),
        email: Joi.string().email(),
        username:  Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
        verifyPassword: Joi.ref('password')
      },
      getInitialState: function() {
        return {
          firstName: null,
          lastName: null,
          email: null,
          username: null,
          password: null,
          verifyPassword: null
        };
      },
      render: function() {
        return (
          <section className='row'>
            <h3>Sign Up</h3>
            <form onSubmit={this.handleSubmit} className='form-horizontal'>
              <fieldset>
                <div className={this.getClasses('firstName')}>
                  <label htmlFor='firstName'>First Name</label>
                  <input type='text' id='firstName' valueLink={this.linkState('firstName')} className='form-control' placeholder='First Name' />
                  {this.getValidationMessages('firstName').map(this.renderHelpText)}
                </div>
                <div className={this.getClasses('lastName')}>
                  <label htmlFor='lastName'>Last Name</label>
                  <input type='text' id='lastName' valueLink={this.linkState('lastName')} className='form-control' placeholder='Last Name' />
                </div>
                <div className={this.getClasses('email')}>
                  <label htmlFor='email'>Email</label>
                  <input type='email' id='email' valueLink={this.linkState('email')} className='form-control' placeholder='Email' />
                  {this.getValidationMessages('email').map(this.renderHelpText)}
                </div>
                <div className={this.getClasses('username')}>
                  <label htmlFor='username'>Username</label>
                  <input type='text' id='username' valueLink={this.linkState('username')} className='form-control' placeholder='Username' />
                  {this.getValidationMessages('username').map(this.renderHelpText)}
                </div>
                <div className={this.getClasses('password')}>
                  <label htmlFor='password'>Password</label>
                  <input type='password' id='password' valueLink={this.linkState('password')} className='form-control' placeholder='Password' />
                  {this.getValidationMessages('password').map(this.renderHelpText)}
                </div>
                <div className={this.getClasses('verifyPassword')}>
                  <label htmlFor='verifyPassword'>Verify Password</label>
                  <input type='password' id='verifyPassword' valueLink={this.linkState('verifyPassword')} className='form-control' placeholder='Verify Password' />
                  {this.getValidationMessages('verifyPassword').map(this.renderHelpText)}
                </div>
                <div className='text-center form-group'>
                  <button type='submit' className='btn btn-large btn-primary'>Sign up</button>
                </div>
              </fieldset>
            </form>
          </section>
        )
      },
      renderHelpText: function(message) {
        return (
          <span className="help-block">{message}</span>
        );
      },
      getClasses: function(field) {
        return React.addons.classSet({
          'form-group': true,
          'has-error': !this.isValid(field)
        });
      },
      handleSubmit: function(event) {
        event.preventDefault();
        if (this.isValid()) {
          UserAction.signup(this.state);
        }
      }
    });

module.exports = Signup;


# Why [Joi](https://github.com/hapijs/joi)?

 Initially I was designing a suite of custom validation strategies to back this mixin, but I quickly realized that was a large initiative of duplicated work. So I refactored this mixin to simply be a wrapper around Joi within the context of a React Component. By doing this I lost some of the flexibility of this mixin; like being able to define custom validators, but Joi is very full featured and custom validations should be handled within their library. This allowed me to offload the responsibility of validation strategies to Joi and keep focused on a simple and clean validation mixin.

### _Please contribute suggestions, features, issues, and pull requests._
