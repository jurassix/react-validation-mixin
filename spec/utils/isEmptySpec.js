import {expect} from 'chai';
import {isEmpty} from '../../src/utils';

describe('isEmpty', function() {
  it('ensures object with no keys is empty', function() {
    var item = {};
    const result = isEmpty(item);
    expect(result).to.equal(true);
  });
  it('ensures object with keys is not empty', function() {
    var item = {a: 'a'};
    const result = isEmpty(item);
    expect(result).to.equal(false);
  });
  it('ensures empty array is empty', function() {
    var list = [];
    const result = isEmpty(list);
    expect(result).to.equal(true);
  });
  it('ensures populated array is not empty', function() {
    var list = [0];
    const result = isEmpty(list);
    expect(result).to.equal(false);
  });
  it('ensures null is empty', function() {
    const result = isEmpty(null);
    expect(result).to.equal(true);
  });
  it('ensures undefined is empty', function() {
    const result = isEmpty();
    expect(result).to.equal(true);
  });
});
