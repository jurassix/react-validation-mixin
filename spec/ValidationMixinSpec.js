var expect = require('chai').expect;
var Joi = require('joi');
var ValidationMixin = require('../ValidationMixin');

function mockComponent(state, validatorTypes) {
  state = state || {};
  validatorTypes = validatorTypes || {};
  return Object.create(ValidationMixin, {
    setState: {
      value: function (state) {
        this.state = Object.assign(this.state, state);
      },
    },

    state: {
      value: Object.assign(state, {errors: {}}),
      writable: true,
    },

    validatorTypes: {
      value: validatorTypes,
    }
  });
}

describe('ValidationMixin', function() {
  describe('validate()', function() {
    it('should keep state errors for flat keys', function() {
      var component = mockComponent({
        username: undefined,
        password: undefined,
      }, {
        username: Joi.string().required(),
        password: Joi.string().required(),
      });

      component.validate();
      expect(Object.keys(component.state.errors)).to.eql(['username', 'password']);
      expect(component.state.errors.username.length).to.eql(1);
      expect(component.state.errors.password.length).to.eql(1);

      component.state.username = 'foo';

      component.validate();
      expect(Object.keys(component.state.errors)).to.eql(['username', 'password']);
      expect(component.state.errors.username.length).to.eql(0);
      expect(component.state.errors.password.length).to.eql(1);

      component.state.password = 'bar';

      component.validate();
      expect(Object.keys(component.state.errors)).to.eql(['username', 'password']);
      expect(component.state.errors.username.length).to.eql(0);
      expect(component.state.errors.password.length).to.eql(0);
    });

    it('should keep state errors for compound keys', function() {
      var component = mockComponent({model: {
        username: 'foo',
        password: undefined,
      }}, {model: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      }});

      component.validate();
      expect(Object.keys(component.state.errors)).to.eql(['model.username', 'model.password']);
      expect(component.state.errors['model.username'].length).to.eql(0);
      expect(component.state.errors['model.password'].length).to.eql(1);

      component.state.model.password = 'bar';

      component.validate();
      expect(Object.keys(component.state.errors)).to.eql(['model.username', 'model.password']);
      expect(component.state.errors['model.username'].length).to.eql(0);
      expect(component.state.errors['model.password'].length).to.eql(0);
    });
  });
});
