import React from 'react';
import classnames from 'classnames';
import Joi from 'joi';
import set from 'lodash.set';

var Signup = React.createClass({
  displayName: 'Signup',
  validatorTypes:  {
    auth: {
      firstName: Joi.string().required().label('First Name'),
      lastName: Joi.string().allow(null).label('Last Name'),
    },
    email: Joi.string().email().label('Email Address'),
    username:  Joi.string().alphanum().min(3).max(30).required().label('Username'),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).label('Password'),
    verifyPassword: Joi.any().valid(Joi.ref('password')).required().label('Password Confirmation'),
    referral: Joi.any().valid('tv', 'radio'),
    rememberMe: Joi.boolean(),
  },
  getValidatorData: function() {
    return this.state;
  },
  getInitialState: function() {
    return {
      auth: {
        firstName: null,
        lastName: null,
      },
      email: null,
      username: null,
      password: null,
      verifyPassword: null,
      rememberMe: 'off',
      referral: null,
      feedback: null,
    };
  },
  render: function() {
    return (
      <section className='row'>
        <h3>Signup</h3>
        <form onSubmit={this.handleSubmit} className='form-horizontal'>
          <fieldset>
            <div className={this.getClasses('auth.firstName')}>
              <label htmlFor='firstName'>First Name</label>
              <input type='text' id='firstName' ref='firstName' value={this.state.auth.firstName} onChange={this.onChange('auth.firstName')} onBlur={this.props.handleValidation('auth.firstName')} className='form-control' placeholder='First Name' />
              {this.props.getValidationMessages('auth.firstName').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('auth.lastName')}>
              <label htmlFor='lastName'>Last Name</label>
              <input type='text' id='lastName' ref='lastName' value={this.state.auth.lastName} onChange={this.onChange('auth.lastName')} onBlur={this.props.handleValidation('auth.lastName')} className='form-control' placeholder='Last Name' />
            </div>
            <div className={this.getClasses('email')}>
              <label htmlFor='email'>Email</label>
              <input type='email' id='email' ref='email' value={this.state.email} onChange={this.onChange('email')} onBlur={this.props.handleValidation('email')}  className='form-control' placeholder='Email' />
              {this.props.getValidationMessages('email').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('username')}>
              <label htmlFor='username'>Username</label>
              <input type='text' id='username' ref='username' value={this.state.username} onChange={this.onChange('username')} onBlur={this.props.handleValidation('username')} className='form-control' placeholder='Username' />
              {this.props.getValidationMessages('username').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('password')}>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' ref='password' value={this.state.password} onChange={this.onChange('password')} onBlur={this.props.handleValidation('password')} className='form-control' placeholder='Password' />
              {this.props.getValidationMessages('password').map(this.renderHelpText)}
            </div>
            <div className={this.getClasses('verifyPassword')}>
              <label htmlFor='verifyPassword'>Verify Password</label>
              <input type='password' id='verifyPassword' ref='verifyPassword' value={this.state.verifyPassword} onChange={this.onChange('verifyPassword')} onBlur={this.props.handleValidation('verifyPassword')}  className='form-control' placeholder='Verify Password' />
              {this.props.getValidationMessages('verifyPassword').map(this.renderHelpText)}
            </div>
            <div className='form-group'>
              <label htmlFor='referral'>How did you hear about us?</label>
              <label htmlFor='tv' className="radio-inline">
                <input type='checkbox' id="tv" ref='tv' name='referral' value='tv' checked={this.state.referral === 'tv'} onChange={this.onRadioChange('referral')}/>
                {' '}tv
              </label>
              <label htmlFor='radio' className="radio-inline">
                <input type='checkbox' id="radio" ref='radio' name='referral' value='radio' checked={this.state.referral === 'radio'} onChange={this.onRadioChange('referral')}/>
                {' '}radio
              </label>
              {this.props.getValidationMessages('referral').map(this.renderHelpText)}
            </div>
            <div className='form-group'>
              <label htmlFor='rememberMe'>
                Remember me{' '}
                <input type='checkbox' id='rememberMe' ref='rememberMe' value='on' checked={this.state.rememberMe === 'on'} onChange={this.onCheckboxChange('rememberMe')}/>
              </label>
              {this.props.getValidationMessages('rememberMe').map(this.renderHelpText)}
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
    return classnames({
      'form-group': true,
      'has-error': !this.props.isValid(field)
    });
  },
  onChange: function(field) {
    return event => {
      this.setState(set(this.state, field, event.target.value));
    };
  },
  onCheckboxChange: function(field) {
    return event => {
      let state = {};
      state[field] = this.state[field] === 'on' ? 'off' : 'on';
      this.setState(state, this.props.handleValidation(field));
    };
  },
  onRadioChange: function(field) {
    return event => {
      let state = {};
      state[field] = event.target.value;
      this.setState(state, this.props.handleValidation(field));
    };
  },
  handleReset: function(event) {
    event.preventDefault();
    this.props.clearValidations();
    this.setState(this.getInitialState());
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var onValidate = error => {
      if (error) {
        this.setState({
          feedback: 'Form is invalid do not submit'
        });
      } else {
        this.setState({
          feedback: 'Form is valid send to action creator'
        });
      }
    };
    this.props.validate(onValidate);
  }
});

module.exports = Signup;
