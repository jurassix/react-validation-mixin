var expect = require('chai').expect;
var flattenAndResetTo = require('../helpers').flattenAndResetTo;
require('object.assign').shim();

describe('Helpers', function() {
  describe('flattenAndResetTo()', function() {
    it('should work with depth 0', function() {
      var data = {
        username: "xxx",
        password: "xxx"
      };

      expect(flattenAndResetTo(data, undefined)).to.be.eql({
        'username': undefined,
        'password': undefined,
      });

      expect(flattenAndResetTo(data, [])).to.be.eql({
        'username': [],
        'password': [],
      });
    });

    it('should work with depth 1', function() {
      var data = {
        model1: {
          username: "xxx",
          password: "xxx"
        },
        model2: {
          username: "xxx",
          password: "xxx"
        }
      };

      expect(flattenAndResetTo(data, undefined)).to.be.eql({
        'model1.username': undefined,
        'model1.password': undefined,
        'model2.username': undefined,
        'model2.password': undefined
      });

      expect(flattenAndResetTo(data, [])).to.be.eql({
        'model1.username': [],
        'model1.password': [],
        'model2.username': [],
        'model2.password': []
      });
    });

    it('should work with depth 2', function() {
      var data = {
        nsp1: {
          model1: {
            username: "xxx",
            password: "xxx"
          },
          model2: {
            username: "xxx",
            password: "xxx"
          }
        },
        nsp2: {
          model1: {
            username: "xxx",
            password: "xxx"
          },
          model2: {
            username: "xxx",
            password: "xxx"
          }
        }
      };

      expect(flattenAndResetTo(data, undefined)).to.be.eql({
        'nsp1.model1.username': undefined,
        'nsp1.model1.password': undefined,
        'nsp1.model2.username': undefined,
        'nsp1.model2.password': undefined,
        'nsp2.model1.username': undefined,
        'nsp2.model1.password': undefined,
        'nsp2.model2.username': undefined,
        'nsp2.model2.password': undefined
      });

      expect(flattenAndResetTo(data, [])).to.be.eql({
        'nsp1.model1.username': [],
        'nsp1.model1.password': [],
        'nsp1.model2.username': [],
        'nsp1.model2.password': [],
        'nsp2.model1.username': [],
        'nsp2.model1.password': [],
        'nsp2.model2.username': [],
        'nsp2.model2.password': []
      });
    });
  });
});
