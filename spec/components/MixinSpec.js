import {expect} from 'chai';
import React from 'react';
import {findDOMNode} from 'react-dom';
import SignupComponent from './Signup';
import TestUtils from 'react-addons-test-utils';
import strategy from 'joi-validation-strategy';
import validation from '../../src/components/validationMixin';

const Signup = validation(strategy)(SignupComponent);

describe('Validation Mixin', function() {
  it('wraps components displayName correctly', () => {
    expect(Signup.displayName).to.equal('Validation(Signup)')
  });
  it('validates field on blur', function() {
    const signup = TestUtils.renderIntoDocument(<Signup/>);
    const email = findDOMNode(signup.refs.component.refs.email);

    TestUtils.Simulate.blur(email);
    expect(signup.isValid('email')).to.equal(false);
    TestUtils.Simulate.change(email, {
      target: {
        value: 'invalid.email.com'
      }
    });

    TestUtils.Simulate.blur(email);
    expect(signup.isValid('email')).to.equal(false);

    TestUtils.Simulate.change(email, {
      target: {
        value: 'valid@email.com'
      }
    });

    TestUtils.Simulate.blur(email);
    expect(signup.isValid('email')).to.equal(true);
  });

  it('ensure previous invalid fields remain invalid', function() {
    const signup = TestUtils.renderIntoDocument(<Signup/>);
    const email = findDOMNode(signup.refs.component.refs.email);
    const username = findDOMNode(signup.refs.component.refs.username);

    TestUtils.Simulate.blur(email);
    expect(signup.isValid('username')).to.equal(true);
    expect(signup.isValid('email')).to.equal(false);

    TestUtils.Simulate.blur(username);
    expect(signup.isValid('username')).to.equal(false);
    expect(signup.isValid('email')).to.equal(false);
  });

  it('ensure submit on invalid form is invalid', function(done) {
    const signup = TestUtils.renderIntoDocument(<Signup/>);
    const form = TestUtils.findRenderedDOMComponentWithTag(signup, 'form');

    //need to mock for submit
    signup.refs.component.props.validate(function() {
      expect(signup.isValid()).to.equal(false);
      done();
    });
  });

  it('ensure submit on valid form is valid', function(done) {
    const signup = TestUtils.renderIntoDocument(<Signup/>);
    const form = TestUtils.findRenderedDOMComponentWithTag(signup, 'form');

    const firstName = findDOMNode(signup.refs.component.refs.firstName);
    const lastName = findDOMNode(signup.refs.component.refs.lastName);
    const email = findDOMNode(signup.refs.component.refs.email);
    const username = findDOMNode(signup.refs.component.refs.username);
    const password = findDOMNode(signup.refs.component.refs.password);
    const verifyPassword = findDOMNode(signup.refs.component.refs.verifyPassword);
    const tv = findDOMNode(signup.refs.component.refs.tv);

    TestUtils.Simulate.change(firstName, {
      target: {
        value: 'foo'
      }
    });

    TestUtils.Simulate.change(lastName, {
      target: {
        value: 'boo'
      }
    });

    TestUtils.Simulate.change(email, {
      target: {
        value: 'foo@boo.com'
      }
    });

    TestUtils.Simulate.change(username, {
      target: {
        value: 'seaweed'
      }
    });

    TestUtils.Simulate.change(password, {
      target: {
        value: 'Luxury123'
      }
    });

    TestUtils.Simulate.change(verifyPassword, {
      target: {
        value: 'Luxury123'
      }
    });

    TestUtils.Simulate.change(tv, {
      target: {
        value: 'tv'
      }
    });

    //need to mock for submit
    signup.refs.component.props.validate(function() {
      expect(signup.isValid()).to.equal(true);
      done();
    });
  });
});
