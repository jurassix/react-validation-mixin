import {expect} from 'chai';
import defined from '../../src/utils/defined';

describe('defined', function() {
  it('ensures null item is not defined', function() {
    var item = null;
    const result = defined(item);
    expect(result).to.equal(false);
  });
  it('ensures undefined item is not defined', function() {
    var item;
    const result = defined(item);
    expect(result).to.equal(false);
  });
  it('ensures item is defined', function() {
    var item = 'a';
    const result = defined(item);
    expect(result).to.equal(true);
  });
  it('ensures if one item is not defined result is falsey', function() {
    var item1 = 'a';
    var item2;
    const result = defined(item1, item2);
    expect(result).to.equal(false);
  });
  it('ensures whem multiple items are defined result is truthy', function() {
    var item1 = 'a';
    var item2 = {};
    const result = defined(item1, item2);
    expect(result).to.equal(true);
  });
});
