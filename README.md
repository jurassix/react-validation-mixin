# react-validation-mixin
Very simple validation mixin for React

### Install

Install mixin via npm:

    > npm install --save react-validation-mixin

Install vaidation strategies via npm:

    > npm install --save react-validation-strategies

_See [react-validation-strategies](https://github.com/jurassix/react-validation-strategies) for a full list of validation strategies._

### API

Mixin has a single required object (or function) to define:

    validatorTypes: {
      'username': isRequired,
      'password': [isRequired, isLength(12)]
    }

Fields can be validated against a single or multiple strategies.

To validate a single field:

    this.isValid('username') // returns boolean for only this field

To validate all fields:

    this.isValid() // return boolean for all fields

To get validation messages for a single field:

    this.getMessages('username') // returns array of strings

### Example Component:

    var React = require('react/addons');
    var ReactValidationMixin = require('react-validation-mixin');
    var ValidationStrategies = require('react-validation-strategies');
    var UserAction = require('../actions/UserAction');

    var isRequired = ValidationStrategies.isRequired;
    var isLength = ValidationStrategies.isLength;

    var Signin = React.createClass({
      displayName: 'Signin',
      mixins: [ReactValidationMixin],
      validatorTypes:  {
        'username': isRequired,
        'password': [isRequired, isLength(12)]
      },
      getInitialState: function() {
        return {
          username: null,
          password: null
        };
      },
      render: function() {
        return (
          <form onSubmit={this.handleSubmit} className='form-horizontal'>
            <fieldset>
              <div className={this.getClasses('username')}>
                <label htmlFor='username'>Username</label>
                <input type='text' className='form-control' placeholder='Username' onChange={this.handleOnChange('username')}/>
                {this.getMessages('username').map(this.renderHelpText)}
              </div>
              <div className={this.getClasses('password')}>
                <label htmlFor='password'>Password</label>
                <input type='password' className='form-control' placeholder='Password' onChange={this.handleOnChange('password')}/>
                {this.getMessages('password').map(this.renderHelpText)}
              </div>
              <div className='text-center form-group'>
                <button type='submit' className='btn btn-primary'>Sign in</button>
              </div>
            </fieldset>
          </form>
        );
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
      handleOnChange: function(field) {
        return (function(_this) {
          return function(event) {
            var newState = {};
            newState[field] = event.currentTarget.value;
            return _this.setState(newState);
          }
        })(this);
      },
      handleSubmit: function(event) {
        event.preventDefault();
        if (this.isValid()) {
          UserAction.signin({
            username: this.state.username,
            password: this.state.password
          });
        }
      }
    });

    module.exports = Signin;

### Create custom strategies
Simply define a function that will take a single value and return an error message if validation fails, return `undefied` otherwise:

    module.exports = function isValidEmail(email) {
      // http://stackoverflow.com/a/46181/1723135
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)) {
        return 'Invalid Email Address';
      }
    };
