# react-validation-mixin
Simple validation mixin for React.

This library provides the boilerplate needed to validate a React component.

**react-validation-mixin** aims to provide a low-to-mid level toolkit for *state or props* validation, relying on existing validation libraries. This mixin currently supports [Joi](https://github.com/hapijs/joi) which aligns perfectly with React.

Simply define the validation schema using Joi validators, and the mixin will give you access to each fields validity and error messages.

[View DEMO](http://jurassix.github.io/react-validation-mixin/)

## Install

Install mixin via npm:

    > npm install --save react-validation-mixin

Make sure you install the peer dependency Joi:

    > npm install --save joi

*See [Joi](https://github.com/hapijs/joi) for a full list of api validation strategies available.*

## Usage

### `validatorTypes`

validatorTypes is the Joi object schema defining the validity of a component.

validatorTypes can be defined as an **object or function**, as long as a valid Joi schema is returned.

You do not have to provide validation for all state fields.

*See [Joi](https://github.com/hapijs/joi) for a full list of api validation strategies available.*

```javascript
// defined as object
validatorTypes: {
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
}

// defined as function
validatorTypes: function() {
  return Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
  });
}

// defined as a function with conditional component state
validatorTypes: function() {
  var base = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().allow(null),
    email: Joi.string().email(),
    username:  Joi.string().alphanum().min(3).max(30).required()
  });
  if (this.props.user.anonymous) {
    return base.keys({
      newPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
      verifyPassword: Joi.ref('newPassword')
    });
  } else {
    return base;
  }
}
```

### `validate([key,] callback)`

Asynchronous validation of entire form or specifc key if provided. Error-first callback will return an error if form or key is invalid.

This API allows developers to validate a single field or the entire form if no key is provided.

```javascript
this.validate(function(error, data) {
  if(error) {
    // form contains errors
    return;
  }
  // form is valid, fire action
});

```

### `handleValidation([key, callback])`

higher order function that returns an event handler for asynchronous validation of specifc key or entire form if no key is provided. Optional error-first callback will return an error if form or key is invalid.

This is a simple wrapper around `this.validate(key, callback)`.

Allows the developer to easily validate onBlur, onChange, etc.

```javascript
onBlur={this.handleValidation('username')} // returns an event handler to validate this field
```

### `isValid([key])`

returns true|false depending on the validity of the current state.

This API is a wrapper around `this.state.errors`, that allows developers to check for the validity of a single field or entire form.

```javascript
this.isValid('username'); // returns boolean for validity of only this field

this.isValid(); // returns boolean for validity of all fields in schema
```

### `getValidationMessages([key])`

returns an array of validation messages for this field.

This API is a wrapper around `this.state.errors`, that returns validations for a single key, or all validations.

```javascript
this.getValidationMessages('username'); // returns array of messages for this field or empty array if valid

this.getValidationMessages(); // returns array of messages for all fields or empty array if valid
```

### `getValidatorData`

This API provides a way for developers to validate props, state, or a combination of both.

**By default, *react-validation-mixin* will only validate a components *state*.**

getValidatorData should be defined as an **object or function**, as long as a valid Object is returned.

```javascript
// defined as object
getValidatorData: this.props

// defined as function
getValidatorData: function() {
  return Object.assign({}, this.props, this.state);
}
```

### `this.state.errors`

Validation results are stored on the components state, allowing developers direct access to the underlying validity of the form.

# Example Component:

```javascript
var React = require('react/addons');
var ValidationMixin = require('react-validation-mixin');
var Joi = require('joi');

var Signup = React.createClass({
  displayName: 'Signup',
  mixins: [ValidationMixin, React.addons.LinkedStateMixin],
  validatorTypes:  {
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().allow(null).label('Last Name'),
    email: Joi.string().email().label('Email Address'),
    username:  Joi.string().alphanum().min(3).max(30).required().label('Username'),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).label('Password'),
    verifyPassword: Joi.any().valid(Joi.ref('password')).required().label('Password Confirmation')
  },
  getInitialState: function() {
    return {
      firstName: null,
      lastName: null,
      email: null,
      username: null,
      password: null,
      verifyPassword: null,
      feedback: null
    };
  },
  render: function() {
    return (
      <section className='row'>
        <h3>Signup</h3>
        <form onSubmit={this.handleSubmit} className='form-horizontal'>
          <fieldset>
            <div className={this.getClasses('firstName')}>
              <label htmlFor='firstName'>First Name</label>
              <input type='text' id='firstName' ref='firstName' valueLink={this.linkState('firstName')} onBlur={this.handleValidation('firstName')} className='form-control' placeholder='First Name' />
              {this.getValidationMessages('firstName').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('lastName')}>
              <label htmlFor='lastName'>Last Name</label>
              <input type='text' id='lastName' valueLink={this.linkState('lastName')} onBlur={this.handleValidation('lastName')} className='form-control' placeholder='Last Name' />
            </div>
            <div className={this.getClasses('email')}>
              <label htmlFor='email'>Email</label>
              <input type='email' id='email' valueLink={this.linkState('email')} onBlur={this.handleValidation('email')}  className='form-control' placeholder='Email' />
              {this.getValidationMessages('email').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('username')}>
              <label htmlFor='username'>Username</label>
              <input type='text' id='username' valueLink={this.linkState('username')} onBlur={this.handleValidation('username')} className='form-control' placeholder='Username' />
              {this.getValidationMessages('username').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('password')}>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' valueLink={this.linkState('password')} onBlur={this.handleValidation('password')} className='form-control' placeholder='Password' />
              {this.getValidationMessages('password').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('verifyPassword')}>
              <label htmlFor='verifyPassword'>Verify Password</label>
              <input type='password' id='verifyPassword' valueLink={this.linkState('verifyPassword')} onBlur={this.handleValidation('verifyPassword')}  className='form-control' placeholder='Verify Password' />
              {this.getValidationMessages('verifyPassword').map(this.renderHelpText)}
            </div>
            <div className='form-group'>
              <h3>{this.state.feedback}</h3>
            </div>
            <div className='text-center form-group'>
              <button type='submit' className='btn btn-large btn-primary'>Sign up</button>
              {' '}
              <button onClick={this.handleReset} className='btn btn-large btn-info'>Reset</button>
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
  handleReset: function(event) {
    event.preventDefault();
    this.clearValidations();
    this.setState(this.getInitialState());
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var onValidate = function(error, validationErrors) {
      if (error) {
        this.setState({
          feedback: 'Form is invalid do not submit'
        });
      } else {
        this.setState({
          feedback: 'Form is valid send to action creator'
        });
      }
    }.bind(this);
    this.validate(onValidate);
  }
});

module.exports = Signup;
```

## Human readable errors

Messages like "serialNumber must be a number" are not very friendly.
Joi provides an option to override key name in message with [label](https://github.com/hapijs/joi#anylabelname) method.

```javascript
validatorTypes: function() {
  return {
    serialNumber: Joi.number().required().label("Serial Number"),
    assemblyDate: Joi.date().required().label("Assembly Date"),
    manufacturer: Joi.string().required().label("Manufacturer),
  };
}
```

But you, probably, have already defined labels in your form declaration and don't want to repeat it again. To manually handle this it's possible to make `validatorTypes` a function and access field labels by `this.refs`.

```javascript
validatorTypes: function() {
  return {
    serialNumber: Joi.number().required().label(this.refs.serialNumber.props.label),
    assemblyDate: Joi.date().required().label(this.refs.assemblyDate.props.label),
    manufacturer: Joi.string().required().label(this.refs.manufacturer.props.label),
  };
},
```

It's a bit more in-sync, but even more verbose :(

## Release Notes

4.0.0 (Major release with breaking API changes):

  * `validatorData` is now `getValidatorData` to be more idiomatic of React
  * `validate` now takes an error-first callback, which allows for a simpler API when validating on Submit. `validate` also takes an optional key as a first param that can be used to validate a single form field.
  * `isValid` is now a simple wrapper around `this.state.errors` **see example for handling form submission in 4.x.x**
  * `clearValidations` has been added to reset all current errors.
  * `handleValidations` now takes a second parameter error-first callback that can be used for custom handling of errors.


### _Please contribute suggestions, features, issues, and pull requests._
