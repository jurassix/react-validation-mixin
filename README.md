# react-validation-mixin
Simple validation mixin for React using [Joi](https://github.com/hapijs/joi)

### Install

Install mixin via npm:

    > npm install --save react-validation-mixin

Make sure you install the peer dependency Joi:

    > npm install --save joi

_See [Joi](https://github.com/hapijs/joi) for a full list of api validation strategies available._

### API

Add the mixin to your React Component:

    mixins: [ValidationMixin]

The Mixin has a single required object (or function) to define on your component. ValidatorTypes is the Joi schema that defines the validity of this componets state.

_This map is the validation description for the components State. Each of the keys of the map should correspond to a key in your state._

    validatorTypes: {
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
    }

To validate a single field:

    this.isValid('username') // returns boolean for validitiy of only this field

To validate all fields:

    this.isValid() // return boolean for validity of all fields

To get validation messages for a single field:

    this.getValidationMessages('username') // returns array of strings

### Example Component:

    var React = require('react/addons');
    var ValidationMixin = require('react-validation-mixin');
    var Joi = require('joi');
    var ValidationStrategies = require('validator');
    var UserAction = require('../actions/UserAction');

    var Signin = React.createClass({
      displayName: 'Signin',
      mixins: [ValidationMixin],
      validatorTypes:  {
        username:  Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
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
                {this.getValidationMessages('username').map(this.renderHelpText)}
              </div>
              <div className={this.getClasses('password')}>
                <label htmlFor='password'>Password</label>
                <input type='password' className='form-control' placeholder='Password' onChange={this.handleOnChange('password')}/>
                {this.getValidationMessages('password').map(this.renderHelpText)}
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
