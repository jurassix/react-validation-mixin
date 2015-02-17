var React = require('react/addons');
var ValidationMixin = require('../../ValidationMixin');
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
      verifyPassword: null
    };
  },
  render: function() {
    return (
      React.createElement("section", {className: "row"},
        React.createElement("h3", null, "Signup"),
        React.createElement("form", {onSubmit: this.handleSubmit, className: "form-horizontal"},
          React.createElement("fieldset", null,
            React.createElement("div", {className: this.getClasses('firstName')},
              React.createElement("label", {htmlFor: "firstName"}, "First Name"),
              React.createElement("input", {type: "text", id: "firstName", ref: "firstName", valueLink: this.linkState('firstName'), onBlur: this.handleValidation('firstName'), className: "form-control", placeholder: "First Name"}),
              this.getValidationMessages('firstName').map(this.renderHelpText)
            ),
            React.createElement("div", {className: this.getClasses('lastName')},
              React.createElement("label", {htmlFor: "lastName"}, "Last Name"),
              React.createElement("input", {type: "text", id: "lastName", ref: "lastName", valueLink: this.linkState('lastName'), onBlur: this.handleValidation('lastName'), className: "form-control", placeholder: "Last Name"})
            ),
            React.createElement("div", {className: this.getClasses('email')},
              React.createElement("label", {htmlFor: "email"}, "Email"),
              React.createElement("input", {type: "email", id: "email", ref: "email", valueLink: this.linkState('email'), onBlur: this.handleValidation('email'), className: "form-control", placeholder: "Email"}),
              this.getValidationMessages('email').map(this.renderHelpText)
            ),
            React.createElement("div", {className: this.getClasses('username')},
              React.createElement("label", {htmlFor: "username"}, "Username"),
              React.createElement("input", {type: "text", id: "username", ref: "username", valueLink: this.linkState('username'), onBlur: this.handleValidation('username'), className: "form-control", placeholder: "Username"}),
              this.getValidationMessages('username').map(this.renderHelpText)
            ),
            React.createElement("div", {className: this.getClasses('password')},
              React.createElement("label", {htmlFor: "password"}, "Password"),
              React.createElement("input", {type: "password", id: "password", ref: "password", valueLink: this.linkState('password'), onBlur: this.handleValidation('password'), className: "form-control", placeholder: "Password"}),
              this.getValidationMessages('password').map(this.renderHelpText)
            ),
            React.createElement("div", {className: this.getClasses('verifyPassword')},
              React.createElement("label", {htmlFor: "verifyPassword"}, "Verify Password"),
              React.createElement("input", {type: "password", id: "verifyPassword", ref: "verifyPassword", valueLink: this.linkState('verifyPassword'), onBlur: this.handleValidation('verifyPassword'), className: "form-control", placeholder: "Verify Password"}),
              this.getValidationMessages('verifyPassword').map(this.renderHelpText)
            ),
            React.createElement("div", {className: "form-group"},
              React.createElement("h3", null, this.state.feedback)
            ),
            React.createElement("div", {className: "text-center form-group"},
              React.createElement("button", {type: "submit", className: "btn btn-large btn-primary"}, "Sign up"),
              ' ',
              React.createElement("button", {onClick: this.handleReset, className: "btn btn-large btn-info"}, "Reset")
            )
          )
        )
      )
    )
  },
  renderHelpText: function(message) {
    return (
      React.createElement("span", {className: "help-block"}, message)
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
    this.setState(this.getInitialState());
    this.setState({
      errors: undefined,
      feedback: undefined
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    onValidate = function(error, success) {
      if (error) {
        this.setState({
          feedback: 'Form is invalid'
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
