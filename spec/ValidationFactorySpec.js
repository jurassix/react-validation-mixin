var chai = require('chai');
var should = chai.should();

var ValidationFactory = require('../ValidationFactory');

describe('Validation Factory', function() {
  before(function() {
    var alwaysValidStategy = function() {};
    var alwaysInvalidStategy = function() {
      return 'always invalid';
    };
    this.validationTypes = {
      foo: alwaysValidStategy,
      bar: [alwaysValidStategy, alwaysValidStategy],
      goo: alwaysInvalidStategy,
      boo: [alwaysInvalidStategy, alwaysInvalidStategy],
      coo: [alwaysInvalidStategy, alwaysValidStategy]
    };
    this.allValidValidationTypes = {
      foo: alwaysValidStategy,
      bar: [alwaysValidStategy, alwaysValidStategy]
    };
    this.allInvalidValidationTypes = {
      foo: alwaysInvalidStategy,
      bar: [alwaysInvalidStategy, alwaysInvalidStategy]
    };
    this.state = {
      foo: 'bar'
    }
  });
  describe('validation()', function() {
    describe('valid scenarios', function() {
      it('should return no errors for validator with single strategy', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.state)
        result['foo'].should.be.empty;
      });
      it('should return no errors for validator with array of strategies', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.state)
        result['bar'].should.be.empty;
      });
    });
    describe('invalid scenarios', function() {
      it('should throw exception when no validation types are defined', function() {
        chai.expect(function() {
          ValidationFactory.validate(undefined, this.state);
        }).to.throw('config or state undefined');
      });
      it('should throw exception when no state is defined', function() {
        chai.expect(function() {
          ValidationFactory.validate(this.validationTypes, undefined);
        }).to.throw('config or state undefined');
      });
      it('should return error for validator with single failing strategy', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.state)
        result['goo'].should.not.be.empty;
        JSON.stringify(result['goo']).should.equal(JSON.stringify(['always invalid']));
      });
      it('should return multiple errors for validator with array of invalid strategies', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.state)
        result['boo'].should.not.be.empty;
        result['boo'].length.should.equal(2);
        JSON.stringify(result['boo']).should.equal(JSON.stringify(['always invalid', 'always invalid']));
      });
      it('should return error for validator with array of invalid and valid strategies', function() {
        var result = ValidationFactory.validate(this.validationTypes, this.state)
        result['coo'].should.not.be.empty;
        result['coo'].length.should.equal(1);
        JSON.stringify(result['coo']).should.equal(JSON.stringify(['always invalid']));
      });
    });
  });
  describe('isValid()', function() {
    describe('valid scenarios', function() {
      it('should be valid for validator with single strategy for single key', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state);
        var result = ValidationFactory.isValid(validation, 'foo');
        result.should.be.true;
      });
      it('should be valid for validator with array of strategies for single key', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state);
        var result = ValidationFactory.isValid(validation, 'bar');
        result.should.be.true;
      });
      it('should be valid when key not found in validation', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state)   ;
        var result = ValidationFactory.isValid(validation, 'unknown');
        result.should.be.true;
      });
      it('should be valid for validator with single strategy for all keys', function() {
        var validation = ValidationFactory.validate(this.allValidValidationTypes, this.state);
        var result = ValidationFactory.isValid(validation);
        result.should.be.true;
      });
    });
    describe('invalid scenarios', function() {
      it('should be invalid for validator with single failing strategy', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state);
        var result = ValidationFactory.isValid(validation, 'goo');
        result.should.be.false;
      });
      it('should be invalid for validator with array of invalid strategies', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state);
        var result = ValidationFactory.isValid(validation, 'boo');
        result.should.be.false;
      });
      it('should be invalid for validator with array of invalid and valid strategies', function() {
        var validation = ValidationFactory.validate(this.validationTypes, this.state);
        var result = ValidationFactory.isValid(validation, 'coo');
        result.should.be.false;
      });
      it('should be ivalid for validator with array of invalid strategies for all keys', function() {
        var validation = ValidationFactory.validate(this.allInvalidValidationTypes, this.state);
        var result = ValidationFactory.isValid(validation);
        result.should.be.false;
      });
    });
  });
  describe('getValidationMessages()', function() {
    it('should return single error message for key', function() {
      var validation = ValidationFactory.validate(this.validationTypes, this.state);
      var result = ValidationFactory.getValidationMessages(validation, 'goo');
      JSON.stringify(result).should.equal(JSON.stringify(['always invalid']));
    });
    it('should return multiple error messages for key', function() {
      var validation = ValidationFactory.validate(this.validationTypes, this.state);
      var result = ValidationFactory.getValidationMessages(validation, 'boo');
      JSON.stringify(result).should.equal(JSON.stringify(['always invalid', 'always invalid']));
    });
    it('should return empty array when no key is provided', function() {
      var validation = ValidationFactory.validate(this.validationTypes, this.state);
      var result = ValidationFactory.getValidationMessages(validation);
      chai.expect(result).to.be.empty;
    });
    it('should throw when no validation results are provided', function() {
      chai.expect(function() {
        ValidationFactory.getValidationMessages();
      }).to.throw('validations is undefined');
    });
  });
});
