import {expect} from 'chai';
import Joi from 'joi';
import factory from '../src/validationFactory';
import strategy from 'joi-validation-strategy';

const validator = factory(strategy);

describe('Validation Factory', function() {
  describe('validation()', function() {
    describe('edge cases', function() {
      it('should follow `schema` keys', function() {
        var result1 = validator.validate({}, undefined);
        expect(result1).to.eql({});
        var result2 = validator.validate({username: Joi.string()}, undefined);
        expect(result2).to.eql({username: []});
      });

      it('should follow `data` keys', function() {
        var result1 = validator.validate(undefined, {});
        expect(result1).to.eql({});
        var result2 = validator.validate(undefined, {username: 'foo'});
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
        var result = validator.validate(data, schema);
        expect(result).to.eql({
          username: ['"username" is not allowed to be empty'],
          age: [],
          bonus: [],
          password: [],
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
        var result = validator.validate(data, schema);
        expect(result['password'][0]).to.eql('"password" must only contain alpha-numeric characters');
        expect(result['password'][1]).to.eql('"password" length must be at least 6 characters long');
      });

      it('should use labels from Joi Schema', function() {
        var schema = {
          username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
          password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
        };
        var data = {};
        var result = validator.validate(data, schema);

        expect(result['username']).to.eql(['"Username" is required']);
      });
    });

    describe('of specified key', function() {
      it('should validate specified key only', function() {
        var schema = {
          username: Joi.string().required(),
        };
        var data = {};

        var result = validator.validate(data, schema, 'username');
        expect(result['username'].length).to.equal(1);
      });

      it('should not validate other fields', function() {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          username: Joi.string().required(),
          password: Joi.string().required(),
        };
        var data = {password: 'qwerty'};

        var result = validator.validate(data, schema, 'password');
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

        var result = validator.validate(data, schema, 'verifyPassword');
        expect(result['verifyPassword'][0]).to.eql('"verifyPassword" don\'t match password');
      });
    });
  });

  describe('getValidationMessages()', function() {
    describe('key is defined', function() {
      it('should be empty for valid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        var errors = validator.validate(data, schema);
        var result = validator.getValidationMessages(errors, 'username');
        expect(result.length).to.equal(0);
      });

      it('should decode for HTML entity encoder', function() {
        var label = '使用者名稱';
        var schema = {username: Joi.string().required().label(label)};
        var data = {username: ''};
        var errors = validator.validate(data, schema);
        var result = validator.getValidationMessages(errors, 'username');
        expect(result[0]).to.equal('"'+label+'" is not allowed to be empty');
      });

      it('should be filled for invalid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {};
        var errors = validator.validate(data, schema);
        var result = validator.getValidationMessages(errors, 'username');
        expect(result.length).to.equal(1);
      });
    });

    describe('key is undefined', function() {
      it('should be empty for valid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        var errors = validator.validate(data, schema);
        var result = validator.getValidationMessages(errors);
        expect(result.length).to.equal(0);
      });

      it('should be filled for invalid input', function() {
        var label = '使用者名稱';
        var schema = {username: Joi.string().required().label(label)};
        var data = {};
        var errors = validator.validate(data, schema);
        var result = validator.getValidationMessages(errors);
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('"'+label+'" is required');
      });
    });
  });

  describe('isValid()', function() {
    describe('key is defined', function() {
      it('should be true for valid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        var errors = validator.validate(data, schema);
        var result = validator.isValid(errors, 'username');
        expect(result).to.be.true;
      });

      it('should be false for invalid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {};
        var errors = validator.validate(data, schema);
        var result = validator.isValid(errors, 'username');
        expect(result).to.be.false;
      });
    });

    describe('key is undefined', function() {
      it('should be true for valid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        var errors = validator.validate(data, schema);
        var result = validator.isValid(errors);
        expect(result).to.be.true;
      });

      it('should be false for invalid input', function() {
        var schema = {username: Joi.string().required()};
        var data = {};
        var errors = validator.validate(data, schema);
        var result = validator.isValid(errors);
        expect(result).to.be.false;
      });
    });
  });
});
