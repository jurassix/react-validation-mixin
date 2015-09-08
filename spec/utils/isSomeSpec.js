import {expect} from 'chai';
import {isSome} from '../../src/utils';

describe('isSome', function() {
  it('ensures strictly equal to single argument', function() {
    var item;
    const result = isSome(item, undefined);
    expect(result).to.equal(true);
  });
  it('ensures strictly equal to multiple arguments', function() {
    var item;
    const result = isSome(item, undefined, null);
    expect(result).to.equal(true);
  });
  it('ensures returns false when no arguments provided', function() {
    var item;
    const result = isSome(item);
    expect(result).to.equal(false);
  });
  it('ensures strictly equal to multiple arguments negative', function() {
    var item = 'a';
    const result = isSome(item, null, undefined);
    expect(result).to.equal(false);
  });
});
