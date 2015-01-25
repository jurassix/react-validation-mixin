var chai = require('chai');
var should = chai.should();
var Joi = require('joi');

var ValidationFactory = require('../ValidationFactory');

describe('Validation Factory', function() {

  before(function() {

    this.validationTypes = {
      username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
      password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
    };

    this.refValidationTypes = {
      username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
      password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).label('Password'),
      verifyPassword: Joi.ref('password')
    };

    this.state = {
      username: 'bar',
      password: 'ab1'
    };

    this.invalidState = {
      username: 'a_',
      password: 'a_'
    };

    this.additionalState = {
      foo: 'bar'
    };

  });

  describe('validation()', function() {

    describe('valid scenarios', function() {

      it('should return no errors for valid input', function() {

        var options = {
          schema: this.validationTypes,
          state: this.state
        };

        var result = ValidationFactory.validate(options);
        chai.expect(result['username']).to.be.undefined;
        chai.expect(result['password']).to.be.undefined;

      });

      it('should return no errors for undefined input', function() {

        var options = {
          schema: this.validationTypes,
          state: this.additionalState
        };

        var result = ValidationFactory.validate(options);
        chai.expect(result['foo']).to.be.undefined;

      });

      it('should use labels from Joi Schema when creating error messages', function() {

        var options = {
          schema: this.validationTypes,
          state: {}
        };

        var result = ValidationFactory.validate(options);
        JSON.stringify(result['username']).should.equal('["Username is required"]');

      });

      describe('should only validate a specified field', function() {

        it('when field is valid and other fields are invalid', function() {

          var options = {
            schema: this.validationTypes,
            state: {},
            field: 'password'
          };

          var result = ValidationFactory.validate(options);
          chai.expect(result['username']).to.be.undefined;
          chai.expect(result['password']).to.be.undefined;

        });

        it('when field is invalid', function() {

          var options = {
            schema: this.validationTypes,
            state: {},
            field: 'username'
          };

          var result = ValidationFactory.validate(options);
          JSON.stringify(result['username']).should.equal('["Username is required"]');
          chai.expect(result['password']).to.be.undefined;

        });

        it('when field is defined', function() {

          var options = {
            schema: this.validationTypes,
            state: {},
            field: undefined
          };

          var result = ValidationFactory.validate(options);
          JSON.stringify(result['username']).should.equal('["Username is required"]');
          chai.expect(result['password']).to.be.undefined;

        });

        it('when field is a ref include the reference', function() {

          var options = {
            schema: this.refValidationTypes,
            state: {
              username: 'anoyn',
              password: '1234abcd',
              verifyPassword: null
            },
            field: 'verifyPassword'
          };

          var result = ValidationFactory.validate(options);
          JSON.stringify(result['verifyPassword']).should.equal('["verifyPassword must be one of ref:password"]');
          chai.expect(result['password']).to.be.undefined;

        });
      });
    });

    describe('invalid scenarios', function() {

      it('should throw exception when validation types is undefined', function() {

        var options = {
          schema: undefined,
          state: this.state
        };

        chai.expect(function() {
          ValidationFactory.validate(options);
        }).to.throw('schema is undefined');

      });

      it('should not throw exception when state is undefined', function() {

        var options = {
          schema: this.validationTypes,
          state: undefined
        };

        var result = ValidationFactory.validate(options);
        result['username'].should.not.be.empty;
        JSON.stringify(result['username']).should.equal('["Username is required"]');

      });

      it('should validate field and not throw exception when state is undefined', function() {

        var options = {
          schema: this.validationTypes,
          state: undefined,
          field: 'username'
        };

        var result = ValidationFactory.validate(options);
        result['username'].should.not.be.empty;
        JSON.stringify(result['username']).should.equal('["Username is required"]');

      });

      it('should return multiple errors for input failing multiple validations', function() {

        var options = {
          schema: this.validationTypes,
          state: this.invalidState
        };

        var result = ValidationFactory.validate(options);
        result['username'].should.not.be.empty;
        JSON.stringify(result['username']).should.equal('["Username must only contain alpha-numeric characters","Username length must be at least 3 characters long"]');

      });

      it('should return single error for input failing single validations', function() {

        var options = {
          schema: this.validationTypes,
          state: this.invalidState
        };

        var result = ValidationFactory.validate(options);
        result['password'].should.not.be.empty;
        JSON.stringify(result['password']).should.equal('["password fails to match the required pattern"]');

      });
    });
  });

  describe('isValid()', function() {

    describe('valid scenarios', function() {

      it('should be true if input field is valid', function() {

        var options = {
          schema: this.validationTypes,
          state: this.state
        };

        var validation = ValidationFactory.validate(options);
        var result = ValidationFactory.isValid(validation, 'username');
        result.should.be.true;

      });

      it('should be valid when fieldName not found in validation', function() {

        var options = {
          schema: this.validationTypes,
          state: this.state
        };

        var validation = ValidationFactory.validate(options);
        var result = ValidationFactory.isValid(validation, 'unknown');
        result.should.be.true;

      });

      it('should be true when all input is valid', function() {

        var options = {
          schema: this.validationTypes,
          state: this.state
        };

        var validation = ValidationFactory.validate(options);
        var result = ValidationFactory.isValid(validation);
        result.should.be.true;

      });
    });

    describe('invalid scenarios', function() {

      it('should be invalid when input field fails validation', function() {

        var options = {
          schema: this.validationTypes,
          state: this.invalidState
        };

        var validation = ValidationFactory.validate(options);
        var result = ValidationFactory.isValid(validation, 'password');
        result.should.be.false;

      });

      it('should be invalid when input field fails multiple validations', function() {

        var options = {
          schema: this.validationTypes,
          state: this.invalidState
        };

        var validation = ValidationFactory.validate(options);
        var result = ValidationFactory.isValid(validation, 'username');
        result.should.be.false;

      });

      it('should be invalid when all input is any input is invalid', function() {

        var options = {
          schema: this.validationTypes,
          state: this.invalidState
        };

        var validation = ValidationFactory.validate(options);
        var result = ValidationFactory.isValid(validation);
        result.should.be.false;

      });
    });
  });

  describe('getValidationMessages()', function() {

    it('should return multiple error messages for fieldName', function() {

      var options = {
        schema: this.validationTypes,
        state: this.invalidState
      };

      var validation = ValidationFactory.validate(options);
      var result = ValidationFactory.getValidationMessages(validation, 'username');
      JSON.stringify(result).should.equal('["Username must only contain alpha-numeric characters","Username length must be at least 3 characters long"]');

    });

    it('should return single error message for fieldName', function() {

      var options = {
        schema: this.validationTypes,
        state: this.invalidState
      };

      var validation = ValidationFactory.validate(options);
      var result = ValidationFactory.getValidationMessages(validation, 'password');
      JSON.stringify(result).should.equal('["password fails to match the required pattern"]');

    });

    it('should return all messages when no fieldName is provided', function() {

      var options = {
        schema: this.validationTypes,
        state: this.invalidState
      };

      var validation = ValidationFactory.validate(options);
      var result = ValidationFactory.getValidationMessages(validation);
      result.length.should.equal(3);
      JSON.stringify(result).should.equal('["Username must only contain alpha-numeric characters","Username length must be at least 3 characters long","password fails to match the required pattern"]');

    });

    it('should throw when no validation results are provided', function() {

      chai.expect(function() {
        ValidationFactory.getValidationMessages();
      }).to.throw('validations is undefined');

    });
  });
});
