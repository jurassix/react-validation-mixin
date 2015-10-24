import { expect } from 'chai';
import Joi from 'joi';
import factory from '../src/validationFactory';
import strategy from 'joi-validation-strategy';

const validator = factory(strategy);

describe('Validation Factory', () => {
  describe('validation()', () => {
    describe('edge cases', () => {
      it('should use `schema` keys on empty schema', done => {
        validator.validate({}, undefined, undefined, (result) => {
          expect(result).to.eql({});
          done();
        });
      });

      it('should use `schema` keys when schema provided', done => {
        validator.validate({
          username: Joi.string()
        }, undefined, undefined, (result) => {
          expect(result).to.eql({});
          done();
        });
      });

      it('should use `data` keys on empty data', done => {
        validator.validate(undefined, {}, undefined, (result) => {
          expect(result).to.eql({});
          done();
        });
      });

      it('should use `data` keys when data provided', done => {
        validator.validate(undefined, {
          username: 'foo'
        }, undefined, (result) => {
          expect(result).to.eql({});
          done();
        });
      });
    });

    describe('of entire form', () => {
      it('should handle mix of valid, invalid and undefined inputs', done => {
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
        validator.validate(data, schema, undefined, (result) => {
          expect(result).to.deep.eql({
            username: ['"username" is not allowed to be empty'],
          });
          done();
        });
      });

      it('should return multiple errors for multiple failed validations', done => {
        var schema = {
          password: Joi.string().alphanum().min(6),
        };
        var data = {
          password: '???',
        };
        validator.validate(data, schema, undefined, (result) => {
          expect(result['password']).to.deep.eql(['"password" must only contain alpha-numeric characters', '"password" length must be at least 6 characters long']);
          done();
        });
      });

      it('should use labels from Joi Schema', done => {
        var schema = {
          username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
          password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
        };
        var data = {};
        validator.validate(data, schema, undefined, (result) => {
          expect(result['username']).to.deep.eql(['"Username" is required']);
          done();
        });
      });

      it('should return array of items when validating an arry', done => {
        var schema = {
          list: Joi.array().items(Joi.string().required(), Joi.string().required())
        };
        var data = {
          list: [
            'only one item'
          ]
        };
        validator.validate(data, schema, undefined, (result) => {
          expect(result['list']).to.deep.eql(['"list" does not contain 1 required value(s)']);
          done();
        });
      });
    });

    describe('of specified key', () => {
      it('should validate specified key only', done => {
        var schema = {
          username: Joi.string().required(),
        };
        var data = {};

        validator.validate(data, schema, {
          key: 'username'
        }, (result) => {
          expect(result['username']).to.deep.eql(['"username" is required']);
          done();
        });
      });

      it('should not validate other fields', done => {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          username: Joi.string().required(),
          password: Joi.string().required(),
        };
        var data = {
          password: 'qwerty'
        };

        validator.validate(data, schema, {
          key: 'password'
        }, (result) => {
          expect(result).to.have.keys(['password']);
          expect(result['password']).to.be.undefind;
          done();
        });
      });

      it('should handle Joi refs', done => {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          password: Joi.string().required(),
          verifyPassword: Joi.any().valid(Joi.ref('password')).options({
            language: {
              any: {
                allowOnly: 'don\'t match password'
              }
            }
          }).required()
        };
        var data = {
          password: 'qwerty',
          verifyPassword: 'qerty',
        };

        validator.validate(data, schema, {
          key: 'verifyPassword'
        }, (result) => {
          expect(result['verifyPassword']).to.deep.eql(['"verifyPassword" don\'t match password']);
          done();
        });
      });
    });
  });

  describe('getValidationMessages()', () => {
    describe('key is defined', () => {
      it('should be empty for valid input', done => {
        var schema = {
          username: Joi.string().required()
        };
        var data = {
          username: 'bar'
        };
        validator.validate(data, schema, undefined, (errors) => {
          var result = validator.getValidationMessages(errors, 'username');
          expect(result).to.be.empty;
          done();
        });
      });

      it('should decode for HTML entity encoder', done => {
        var label = '使用者名稱';
        var schema = {
          username: Joi.string().required().label(label)
        };
        var data = {
          username: ''
        };
        validator.validate(data, schema, undefined, (errors) => {
          var result = validator.getValidationMessages(errors, 'username');
          expect(result).to.deep.equal(['"' + label + '" is not allowed to be empty']);
          done();
        });
      });

      it('should be have message for invalid input field', done => {
        var schema = {
          username: Joi.string().required()
        };
        var data = {};
        validator.validate(data, schema, undefined, (errors) => {
          var result = validator.getValidationMessages(errors, 'username');
          expect(result).to.deep.equal(['"username" is required']);
          done();
        });
      });
    });

    describe('key is undefined', () => {
      it('should be empty for valid input', done => {
        var schema = {
          username: Joi.string().required()
        };
        var data = {
          username: 'bar'
        };
        validator.validate(data, schema, undefined, (errors) => {
          var result = validator.getValidationMessages(errors);
          expect(result).to.be.empty;
          done();
        });
      });

      it('should be filled for invalid input', done => {
        var label = '使用者名稱';
        var schema = {
          username: Joi.string().required().label(label)
        };
        var data = {};
        validator.validate(data, schema, undefined, (errors) => {
          var result = validator.getValidationMessages(errors);
          expect(result.length).to.equal(1);
          expect(result[0]).to.deep.equal(['"' + label + '" is required']);
          done();
        });
      });
    });
  });

  describe('isValid()', () => {
    describe('key is defined', () => {
      it('should be true for valid input', done => {
        var schema = {
          username: Joi.string().required()
        };
        var data = {
          username: 'bar'
        };
        validator.validate(data, schema, undefined, (errors) => {
          var result = validator.isValid(errors, 'username');
          expect(result).to.be.true;
          done();
        });
      });

      it('should be false for invalid input', done => {
        var schema = {
          username: Joi.string().required()
        };
        var data = {};
        validator.validate(data, schema, undefined, (errors) => {
          var result = validator.isValid(errors, 'username');
          expect(result).to.be.false;
          done();
        });
      });
    });

    describe('key is undefined', () => {
      it('should be true for valid input', done => {
        var schema = {
          username: Joi.string().required()
        };
        var data = {
          username: 'bar'
        };
        validator.validate(data, schema, {}, (errors) => {
          var result = validator.isValid(errors);
          expect(result).to.be.true;
          done();
        });
      });

      it('should be false for invalid input', done => {
        var schema = {
          username: Joi.string().required()
        };
        var data = {};
        validator.validate(data, schema, {}, (errors) => {
          var result = validator.isValid(errors);
          expect(result).to.be.false;
          done();
        });
      });
    });
  });
});
