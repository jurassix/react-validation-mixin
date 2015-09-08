import {expect} from 'chai';
import {result} from '../../src/utils';

describe('result', function() {
  it('ensures value at key is retuned from object', function() {
    var object = {a: 'a'};
    const output = result(object, 'a');
    expect(output).to.equal('a');
  });
  it('ensures defaultValue is retuned from if key not found', function() {
    var object = {};
    const output = result(object, 'a', 'a');
    expect(output).to.equal('a');
  });
  it('ensures value at key is evaluated with proper context and value retuned from object', function() {
    var object = {
      a: function() {
        return this.b;
      },
      b: 'b'
    };
    const output = result(object, 'a');
    expect(output).to.equal('b');
  });
});
