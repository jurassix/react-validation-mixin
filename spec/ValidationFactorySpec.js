var expect = require('chai').expect;
var Joi = require('joi');

var ValidationFactory = require('../ValidationFactory');

describe('Validation Factory', function() {
  describe('validation()', function() {
    describe('edge cases', function() {
      it('should follow `schema` keys', function() {
        var result1 = ValidationFactory.validate({}, undefined);
        expect(result1).to.eql({});
        var result2 = ValidationFactory.validate({username: Joi.string()}, undefined);
        expect(result2).to.eql({username: []});
      });

      it('should follow `data` keys', function() {
        var result1 = ValidationFactory.validate(undefined, {});
        expect(result1).to.eql({});
        var result2 = ValidationFactory.validate(undefined, {username: 'foo'});
        expect(result2).to.eql({username: []});
      });
    });

    describe('of entire form', function() {
      it('should handle mix of valid, invalid and undefined inputs', function() {
        var schema = {
          username: Joi.string().required(),
          age: Joi.number(),
          bonus: Joi.boolean(), // data is undefined
        };
        var data = {
          username: '', // invalid
          password: 'qwerty', // valid required
          age: 10, // valid optional
          something: 'xyz' // schema is undefined
        };
        var result = ValidationFactory.validate(schema, data);
        expect(result).to.eql({
          username: ['username is not allowed to be empty'],
          password: [],
          age: [],
          bonus: [],
          something: [],
        });
      });

      it('should return multiple errors for multiple failed validations', function() {
        var schema = {
          password: Joi.string().alphanum().min(6),
        };
        var data = {
          password: '???',
        };
        var result = ValidationFactory.validate(schema, data);
        expect(result['password']).to.eql([
          'password must only contain alpha-numeric characters',
          'password length must be at least 6 characters long'
        ]);
      });

      it('should use labels from Joi Schema', function() {
        var schema = {
          username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
          password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
        };
        var data = {};
        var result = ValidationFactory.validate(schema, data);

        expect(result['username']).to.eql(['Username is required']);
      });
    });

    describe('of specified key', function() {
      it('should validate specified key only', function() {
        var schema = {
          username: Joi.string().required(),
        };
        var data = {};

        var result = ValidationFactory.validate(schema, data, 'username');
        expect(result['username'].length).to.equal(1);
      });

      it('should not validate other fields', function() {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          username: Joi.string().required(),
          password: Joi.string().required(),
        };
        var data = {password: 'qwerty'};

        var result = ValidationFactory.validate(schema, data, 'password');
        expect(result['password']).to.be.undefined;
      });

      it('should handle Joi refs', function() {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          password: Joi.string().required(),
          verifyPassword: Joi.any().valid(Joi.ref('password')).options({language: {any: {allowOnly: 'don\'t match password'}}}).required()
        };
        var data = {
          password: 'qwerty',
          verifyPassword: 'qerty',
        };

        var result = ValidationFactory.validate(schema, data, 'verifyPassword');
        expect(result['verifyPassword']).to.eql(['verifyPassword don\'t match password']);
      });
    });
  });

  describe('getValidationMessages()', function() {
    describe('key is defined', function() {
      it('should be empty for valid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        var errors = ValidationFactory.validate(schema, data);
        var result = ValidationFactory.getValidationMessages(errors, 'username');
        expect(result.length).to.equal(0);
      });

      it('should be filled for invalid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {};
        var errors = ValidationFactory.validate(schema, data);
        var result = ValidationFactory.getValidationMessages(errors, 'username');
        expect(result.length).to.equal(1);
      });
    });

    describe('key is undefined', function() {
      it('should be empty for valid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        var errors = ValidationFactory.validate(schema, data);
        var result = ValidationFactory.getValidationMessages(errors);
        expect(result.length).to.equal(0);
      });

      it('should be filled for invalid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {};
        var errors = ValidationFactory.validate(schema, data);
        var result = ValidationFactory.getValidationMessages(errors);
        expect(result.length).to.equal(1);
      });
    });
  });

  describe('isValid()', function() {
    describe('key is defined', function() {
      it('should be true for valid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        var errors = ValidationFactory.validate(schema, data);
        var result = ValidationFactory.isValid(errors, 'username');
        expect(result).to.be.true;
      });

      it('should be false for invalid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {};
        var errors = ValidationFactory.validate(schema, data);
        var result = ValidationFactory.isValid(errors, 'username');
        expect(result).to.be.false;
      });
    });

    describe('key is undefined', function() {
      it('should be true for valid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        var errors = ValidationFactory.validate(schema, data);
        var result = ValidationFactory.isValid(errors);
        expect(result).to.be.true;
      });

      it('should be false for invalid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {};
        var errors = ValidationFactory.validate(schema, data);
        var result = ValidationFactory.isValid(errors);
        expect(result).to.be.false;
      });
    });
  });
});
