import { isEqualDay } from 'dummy/helpers/is-equal-day';
import { module, test } from 'qunit';
import moment from 'moment';

module('Unit | Helper | is equal day', function() {
  test('returns true for equal dates', function(assert) {
    let d1 = moment('2016-10-10');
    let result = isEqualDay([d1, d1]);
    assert.ok(result);
  });

  test('returns true for dates on same day', function(assert) {
    let d1 = moment('2016-10-10');
    let d2 = moment('2016-10-10').add(8, 'hours');
    let result = isEqualDay([d1, d2]);
    assert.ok(result);

    d1 = moment('2016-10-10');
    d2 = moment('2016-10-10').add(23, 'hours').add(59, 'minutes').add(59, 'seconds');
    result = isEqualDay([d1, d2]);
    assert.ok(result);
  });

  test('returns false for dates on different days', function(assert) {
    let d1 = moment('2016-10-10');
    let d2 = moment('2016-10-09');
    let result = isEqualDay([d1, d2]);
    assert.notOk(result);

    d1 = moment('2016-10-10');
    d2 = moment('2016-10-11');
    result = isEqualDay([d1, d2]);
    assert.notOk(result);

    d1 = moment('2016-10-10').add(23, 'hours');
    d2 = moment('2016-10-11');
    result = isEqualDay([d1, d2]);
    assert.notOk(result);

    d1 = moment('2016-10-10');
    d2 = moment('2016-10-09').add(23, 'hours');
    result = isEqualDay([d1, d2]);
    assert.notOk(result);

    d1 = moment('2016-10-31');
    d2 = moment('2015-08-31');
    result = isEqualDay([d1, d2]);
    assert.notOk(result);
  });
});