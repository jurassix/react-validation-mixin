import {expect} from 'chai';
import Joi from 'joi';
import factory from '../src/validationFactory';
import strategy from 'joi-validation-strategy';

const validator = factory(strategy);

describe('Validation Factory', function() {
  describe('validation()', function() {
    describe('edge cases', function() {
      it('should use `schema` keys on empty schema', function(done) {
        validator.validate({}, undefined, undefined, function(result) {
          expect(result).to.eql({});
          done();
        });
      });

      it('should use `schema` keys when schema provided', function(done) {
        validator.validate({username: Joi.string()}, undefined, undefined, function(result) {
          expect(result).to.eql({username: []});
          done();
        });
      });

      it('should use `data` keys on empty data', function(done) {
        validator.validate(undefined, {}, undefined, function(result) {
          expect(result).to.eql({});
          done();
        });
      });

      it('should use `data` keys when data provided', function(done) {
        validator.validate(undefined, {username: 'foo'}, undefined, function(result) {
          expect(result).to.eql({username: []});
          done();
        });
      });
    });

    describe('of entire form', function() {
      it('should handle mix of valid, invalid and undefined inputs', function(done) {
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
        validator.validate(data, schema, undefined, function(result) {
          expect(result).to.eql({
            username: ['"username" is not allowed to be empty'],
            age: [],
            bonus: [],
            password: [],
            something: [],
          });
          done();
        });
      });

      it('should return multiple errors for multiple failed validations', function(done) {
        var schema = {
          password: Joi.string().alphanum().min(6),
        };
        var data = {
          password: '???',
        };
        validator.validate(data, schema, undefined, function(result) {
          expect(result['password'][0]).to.eql('"password" must only contain alpha-numeric characters');
          expect(result['password'][1]).to.eql('"password" length must be at least 6 characters long');
          done();
        });
      });

      it('should use labels from Joi Schema', function(done) {
        var schema = {
          username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
          password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
        };
        var data = {};
        validator.validate(data, schema, undefined, function(result) {
          expect(result['username']).to.eql(['"Username" is required']);
          done();
        });
      });
    });

    describe('of specified key', function() {
      it('should validate specified key only', function(done) {
        var schema = {
          username: Joi.string().required(),
        };
        var data = {};

        validator.validate(data, schema, 'username', function(result) {
          expect(result['username'].length).to.equal(1);
          done();
        });
      });

      it('should not validate other fields', function(done) {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          username: Joi.string().required(),
          password: Joi.string().required(),
        };
        var data = {password: 'qwerty'};

        validator.validate(data, schema, 'password', function(result) {
          expect(result['password']).to.be.undefined;
          done();
        });
      });

      it('should handle Joi refs', function(done) {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          password: Joi.string().required(),
          verifyPassword: Joi.any().valid(Joi.ref('password')).options({language: {any: {allowOnly: 'don\'t match password'}}}).required()
        };
        var data = {
          password: 'qwerty',
          verifyPassword: 'qerty',
        };

        validator.validate(data, schema, 'verifyPassword', function(result) {
          expect(result['verifyPassword'][0]).to.eql('"verifyPassword" don\'t match password');
          done();
        });
      });
    });
  });

  describe('getValidationMessages()', function() {
    describe('key is defined', function() {
      it('should be empty for valid input', function(done) {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.getValidationMessages(errors, 'username');
          expect(result.length).to.equal(0);
          done();
        });
      });

      it('should decode for HTML entity encoder', function(done) {
        var label = '使用者名稱';
        var schema = {username: Joi.string().required().label(label)};
        var data = {username: ''};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.getValidationMessages(errors, 'username');
          expect(result[0]).to.equal('"'+label+'" is not allowed to be empty');
          done();
        });
      });

      it('should be filled for invalid input', function(done) {
        var schema = {username: Joi.string().required()};
        var data = {};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.getValidationMessages(errors, 'username');
          expect(result.length).to.equal(1);
          done();
        });
      });
    });

    describe('key is undefined', function() {
      it('should be empty for valid input', function(done) {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.getValidationMessages(errors);
          expect(result.length).to.equal(0);
          done();
        });
      });

      it('should be filled for invalid input', function(done) {
        var label = '使用者名稱';
        var schema = {username: Joi.string().required().label(label)};
        var data = {};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.getValidationMessages(errors);
          expect(result.length).to.equal(1);
          expect(result[0]).to.equal('"'+label+'" is required');
          done();
        });
      });
    });
  });

  describe('isValid()', function() {
    describe('key is defined', function() {
      it('should be true for valid input', function(done) {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.isValid(errors, 'username');
          expect(result).to.be.true;
          done();
        });
      });

      it('should be false for invalid input', function(done) {
        var schema = {username: Joi.string().required()};
        var data = {};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.isValid(errors, 'username');
          expect(result).to.be.false;
          done();
        });
      });
    });

    describe('key is undefined', function() {
      it('should be true for valid input', function(done) {
        var schema = {username: Joi.string().required()};
        var data = {username: 'bar'};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.isValid(errors);
          expect(result).to.be.true;
          done();
        });
      });

      it('should be false for invalid input', function(done) {
        var schema = {username: Joi.string().required()};
        var data = {};
        validator.validate(data, schema, undefined, function(errors) {
          var result = validator.isValid(errors);
          expect(result).to.be.false;
          done();
        });
      });
    });
  });
});
