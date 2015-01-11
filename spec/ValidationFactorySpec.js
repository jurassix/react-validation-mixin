var chai = require('chai');
var should = chai.should();
var Joi = require('joi');

var ValidationFactory = require('../ValidationFactory');

describe('Validation Factory', function() {
  before(function() {
    this.validationTypes = {
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
    };
    this.state = {
      username: 'bar',
      password: 'ab1'
    };
    this.invalidState = {
      username: 'a_',
      password: 'a_'
    }
    this.additionalState = {
      foo: 'bar'
    }
  });
  describe('validation()', function() {
    describe('valid scenarios', function() {
      it('should return no errors for valid input', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.state)
        chai.expect(result['username']).to.be.undefined;
        chai.expect(result['password']).to.be.undefined;
      });
      it('should return no errors for undefined input', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.additionalState)
        chai.expect(result['foo']).to.be.undefined;
        chai.expect(result['password']).to.be.undefined;
        JSON.stringify(result['username']).should.equal('["username is required"]');
      });
    });
    describe('invalid scenarios', function() {
      it('should throw exception when no validation types are defined', function() {
        chai.expect(function() {
          ValidationFactory.validate(undefined, this.state);
        }).to.throw('validationTypes schema is undefined');
      });
      it('should not throw exception when no state is defined', function() {
        var result = ValidationFactory.validate(this.validationTypes, undefined);
        result['username'].should.not.be.empty;
        JSON.stringify(result['username']).should.equal('["username is required"]');
      });
      it('should return multiple errors for input failing multiple validations', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.invalidState)
        result['username'].should.not.be.empty;
        JSON.stringify(result['username']).should.equal('["username must only contain alpha-numeric characters","username length must be at least 3 characters long"]');
      });
      it('should return single error for input failing single validations', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.invalidState)
        result['password'].should.not.be.empty;
        JSON.stringify(result['password']).should.equal('["password fails to match the required pattern"]');
      });
    });
  });
  describe('isValid()', function() {
    describe('valid scenarios', function() {
      it('should be true if input field is valid', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state);
        var result = ValidationFactory.isValid(validation, 'username');
        result.should.be.true;
      });
      it('should be valid when fieldName not found in validation', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state);
        var result = ValidationFactory.isValid(validation, 'unknown');
        result.should.be.true;
      });
      it('should be true when all input is valid', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state);
        var result = ValidationFactory.isValid(validation);
        result.should.be.true;
      });
    });
    describe('invalid scenarios', function() {
      it('should be invalid when input field fails validation', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.invalidState);
        var result = ValidationFactory.isValid(validation, 'password');
        result.should.be.false;
      });
      it('should be invalid when input field fails multiple validations', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.invalidState);
        var result = ValidationFactory.isValid(validation, 'username');
        result.should.be.false;
      });
      it('should be invalid when all input is any input is invalid', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.invalidState);
        var result = ValidationFactory.isValid(validation);
        result.should.be.false;
      });
    });
  });
  describe('getValidationMessages()', function() {
    it('should return multiple error messages for fieldName', function() {
      var validation = ValidationFactory.validate(this.validationTypes, this.invalidState);
      var result = ValidationFactory.getValidationMessages(validation, 'username');
      JSON.stringify(result).should.equal('["username must only contain alpha-numeric characters","username length must be at least 3 characters long"]');
    });
    it('should return single error message for fieldName', function() {
      var validation = ValidationFactory.validate(this.validationTypes, this.invalidState);
      var result = ValidationFactory.getValidationMessages(validation, 'password');
      JSON.stringify(result).should.equal('["password fails to match the required pattern"]');
    });
    it('should return all messages when no fieldName is provided', function() {
      var validation = ValidationFactory.validate(this.validationTypes, this.invalidState);
      var result = ValidationFactory.getValidationMessages(validation);
      result.length.should.equal(3);
      JSON.stringify(result).should.equal('["username must only contain alpha-numeric characters","username length must be at least 3 characters long","password fails to match the required pattern"]');
    });
    it('should throw when no validation results are provided', function() {
      chai.expect(function() {
        ValidationFactory.getValidationMessages();
      }).to.throw('validations is undefined');
    });
  });
});
