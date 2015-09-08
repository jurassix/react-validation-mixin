import {expect} from 'chai';
import {flatten} from '../../src/utils';

describe('flatten', function() {
  it('ensures list is returned if no elements are arrays', function() {
    var list = [0, 1, 2];
    const result = flatten(list);
    expect(result).to.deep.equal(list);
  });
  it('ensures any lists within list are merged in place', function() {
    var list = [0, [1], 2];
    const result = flatten(list);
    expect(result).to.deep.equal([0, 1, 2]);
  });
  it('ensures any lists within list seconded level are merged in place', function() {
    var list = [0, [[1]], 2];
    const result = flatten(list);
    expect(result).to.deep.equal([0, 1, 2]);
  });
});
