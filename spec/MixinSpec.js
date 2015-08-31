import {expect} from 'chai';
import React from 'react';
import {findDOMNode} from 'react-dom';
import Signup from './components/Signup';
import TestUtils from 'react-addons-test-utils';

describe('Validation Mixin', function() {
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
  it('validates form on submit', function() {
    const signup = TestUtils.renderIntoDocument(<Signup/>);
    const form = TestUtils.findRenderedDOMComponentWithTag(signup, 'form');

    TestUtils.Simulate.submit(form);
    expect(signup.isValid()).to.equal(false);

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

    TestUtils.Simulate.submit(form);
    expect(signup.isValid()).to.equal(true);
  });
});
