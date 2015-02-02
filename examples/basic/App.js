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
      verifyPassword: null
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
              <button onClick={this.handleReset} className='btn btn-large btn-warning'>Reset</button>
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
    this.setState(this.getInitialState());
    this.setState({
      errors: undefined,
      feedback: undefined
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    if (this.isValid()) {
      this.setState({
        feedback: 'Form is valid send to action creator'
      });
    } else {
      this.setState({
        feedback: 'Form is invalid'
      });
    }
  }
});

React.render(<Signup />, document.getElementById('app'));
