import { isEqual } from 'dummy/helpers/is-equal';
import { module, test } from 'qunit';

module('Unit | Helper | is equal', function() {
  test('it works', function(assert) {
    let result = isEqual([null, null]);
    assert.ok(result, 'it works for null & null');

    result = isEqual([undefined, undefined]);
    assert.ok(result, 'it works for undefined & undefined');

    result = isEqual([1, 1]);
    assert.ok(result, 'it works for 1 & 1');

    result = isEqual(['aa', 'aa']);
    assert.ok(result, 'it works for aa & aa');

    let obj = {};
    result = isEqual([obj, obj]);
    assert.ok(result, 'it returns true for the same objects');

    result = isEqual([{}, {}]);
    assert.notOk(result, 'it returns false for different objects');

    result = isEqual([1, 2]);
    assert.notOk(result, 'it returns false for different numbers');

    result = isEqual([1, '1']);
    assert.notOk(result, 'it returns false for numbers & strings');
  });
});
