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

### `validate([key])`

validates the specified field, or entire form if no field specifed.

returns errors messages for the field or all messages for the form, depending on the validity of the current state.

This API allows developers to check for the validity of a single field and pull the results from `this.state.errors`. When no field is provided the API validates the entire form.

```javascript
this.validate('username'); // returns boolean for validity of only this field

this.validate(); // returns boolean for validity of all fields in schema
```

### `isValid([key])`

returns true|false depending on the validity of the current state.

This API allows developers to check for the validity of a single field. When no field is provided the API validates the entire form and returns the validity.

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

### `handleValidation([key])`

returns an event handler to validate this key or entire form.

This is a simple wrapper around `this.validate([key])`.

Allows the developer to easily validate onBlur, onChange, etc.


```javascript
onBlur={this.handleValidation('username')} // returns an event handler to validate this field
```

### `validatorData`

validatorData provides a way for developers to validate props, state, or a combination of both.

**By default, *react-validation-mixin* will only validate a components *state*.**

validatorData should be defined as an **object or function**, as long as a valid Object is returned.


```javascript
// defined as object
validatorData: this.props

// defined as function
validatorData: function() {
  return Object.assign({}, this.props, this.state);
}
```

### `this.state.errors`

Validation results are stored on the components state, allowing developers direct access to the underlying validity of the form.

## Example Component:

```javascript
var React = require('react/addons');
var assign = Object.assign || require('object.assign');
var ValidationMixin = require('react-validation-mixin');
var Joi = require('joi');
var UserAction = require('../actions/UserAction');
var SessionStore = require('../stores/SessionStore');

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
    return assign({
      password: null,
      verifyPassword: null
    }, SessionStore.getUser());
  },
  render: function() {
    return (
      <section className='row'>
        <h3>Sign Up</h3>
        <form onSubmit={this.handleSubmit} className='form-horizontal'>
          <fieldset>
            <div className={this.getClasses('firstName')}>
              <label htmlFor='firstName'>First Name</label>
              <input type='text' id='firstName' onBlur={this.handleValidation('firstName')} valueLink={this.linkState('firstName')} className='form-control' placeholder='First Name' />
              {this.getValidationMessages('firstName').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('lastName')}>
              <label htmlFor='lastName'>Last Name</label>
              <input type='text' id='lastName' onBlur={this.handleValidation('lastName')} valueLink={this.linkState('lastName')} className='form-control' placeholder='Last Name' />
            </div>
            <div className={this.getClasses('email')}>
              <label htmlFor='email'>Email</label>
              <input type='email' id='email' onBlur={this.handleValidation('email')} valueLink={this.linkState('email')} className='form-control' placeholder='Email' />
              {this.getValidationMessages('email').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('username')}>
              <label htmlFor='username'>Username</label>
              <input type='text' id='username' onBlur={this.handleValidation('username')} valueLink={this.linkState('username')} className='form-control' placeholder='Username' />
              {this.getValidationMessages('username').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('password')}>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' onBlur={this.handleValidation('password')} valueLink={this.linkState('password')} className='form-control' placeholder='Password' />
              {this.getValidationMessages('password').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('verifyPassword')}>
              <label htmlFor='verifyPassword'>Verify Password</label>
              <input type='password' id='verifyPassword' onBlur={this.handleValidation('verifyPassword')} valueLink={this.linkState('verifyPassword')} className='form-control' placeholder='Verify Password' />
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

## Nested state

`React.addons.LinkedStateMixin` does not support two-way binding for nested fields.
But sometimes you need one. To solve this, you may use `react-lensed-state`.

```javascript
var Signup = React.createClass({
  ...
  mixins: [ValidationMixin, LensedStateMixin], // instead of `LinkedStateMixin`
}
```

Then, in render function:

```html
<div className={this.getClasses("model.username")}>
  <label htmlFor="username">Username</label>
  <input type="username" id="username" valueLink={this.linkState("model.username")} onBlur={this.handleBlurFor("model.username")} ... />
  {this.getValidationMessages("model.username").map(this.renderHelpText)}
</div>
```

### _Please contribute suggestions, features, issues, and pull requests._
