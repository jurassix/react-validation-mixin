var expect = require('chai').expect;
var Joi = require('joi');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Signin = require('./components/Signin');

describe('Validation Mixin', function() {
  it('validates field on blur', function() {
    var signin = TestUtils.renderIntoDocument(React.createElement(Signin));
    var email = signin.refs.email.getDOMNode();

    TestUtils.Simulate.blur(email);
    expect(signin.isValid('email')).to.equal(false);

    TestUtils.Simulate.change(email, {
      target: {
        value: 'invalid.email.com'
      }
    });

    TestUtils.Simulate.blur(email);
    expect(signin.isValid('email')).to.equal(false);

    TestUtils.Simulate.change(email, {
      target: {
        value: 'valid@email.com'
      }
    });

    TestUtils.Simulate.blur(email);
    expect(signin.isValid('email')).to.equal(true);

  });
  it('validates form on submit', function() {
    var signin = TestUtils.renderIntoDocument(React.createElement(Signin));
    var form = TestUtils.findRenderedDOMComponentWithTag(
      signin, 'form');

    TestUtils.Simulate.submit(form);
    expect(signin.isValid()).to.equal(false);

    var firstName = signin.refs.firstName.getDOMNode();
    var lastName = signin.refs.lastName.getDOMNode();
    var email = signin.refs.email.getDOMNode();
    var username = signin.refs.username.getDOMNode();
    var password = signin.refs.password.getDOMNode();
    var verifyPassword = signin.refs.verifyPassword.getDOMNode();

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

    TestUtils.Simulate.submit(form);
    expect(signin.isValid()).to.equal(true);
  });
});
