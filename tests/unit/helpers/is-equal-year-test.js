import { isEqualYear } from 'dummy/helpers/is-equal-year';
import { module, test } from 'qunit';
import moment from 'moment';

module('Unit | Helper | is equal year');

test('returns true for equal dates', function (assert) {
  let d1 = moment('2016-10-10');
  let result = isEqualYear([d1, d1]);
  assert.ok(result);
});

test('returns true for dates on same day', function (assert) {
  let d1 = moment('2016-10-10');
  let d2 = moment('2016-10-10').add(8, 'hours');
  let result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-10-10');
  d2 = moment('2016-10-10').add(23, 'hours').add(59, 'minutes').add(59, 'seconds');
  result = isEqualYear([d1, d2]);
  assert.ok(result);
});

test('returns true for dates on different days in same month', function (assert) {
  let d1 = moment('2016-10-10');
  let d2 = moment('2016-10-09');
  let result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-10-10');
  d2 = moment('2016-10-11');
  result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-10-10').add(23, 'hours');
  d2 = moment('2016-10-11');
  result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-10-10');
  d2 = moment('2016-10-09').add(23, 'hours');
  result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-10-01');
  d2 = moment('2016-10-31');
  result = isEqualYear([d1, d2]);
  assert.ok(result);
});

test('returns true for dates in different months', function (assert) {
  let d1 = moment('2016-10-01');
  let d2 = moment('2016-09-30');
  let result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-10-31');
  d2 = moment('2016-11-01');
  result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-10-01');
  d2 = moment('2016-09-30').add(23, 'hours');
  result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-10-31').add(23, 'hours');
  d2 = moment('2016-11-01');
  result = isEqualYear([d1, d2]);
  assert.ok(result);

  d1 = moment('2016-01-01');
  d2 = moment('2016-12-31');
  result = isEqualYear([d1, d2]);
  assert.ok(result);
});

test('returns false for dates in different years', function (assert) {
  let d1 = moment('2016-10-01');
  let d2 = moment('2015-10-01');
  let result = isEqualYear([d1, d2]);
  assert.notOk(result);

  d1 = moment('2016-01-01');
  d2 = moment('2015-12-31');
  result = isEqualYear([d1, d2]);
  assert.notOk(result);
});
