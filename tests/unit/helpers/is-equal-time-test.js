import { isEqualTime } from 'dummy/helpers/is-equal-time';
import { module, test } from 'qunit';
import moment from 'moment';

module('Unit | Helper | is equal time', function() {
  test('returns true for equal times', function(assert) {
    let d1 = moment('2016-10-10');
    let result = isEqualTime([d1, d1]);
    assert.ok(result);
  });

  test('returns true for equal times on same day', function(assert) {
    let d1 = moment('2016-10-10')
      .hours(4)
      .minutes(3);
    let d2 = moment('2016-10-10')
      .hours(4)
      .minutes(3);
    let result = isEqualTime([d1, d2]);
    assert.ok(result);
  });

  test('returns true for equal times on different days', function(assert) {
    let d1 = moment('2016-10-10')
      .hours(4)
      .minutes(3);
    let d2 = moment('2016-10-11')
      .hours(4)
      .minutes(3);
    let result = isEqualTime([d1, d2]);
    assert.ok(result);
  });

  test('it ignores seconds / milliseoncds', function(assert) {
    let d1 = moment('2016-10-10')
      .hours(4)
      .minutes(3);
    let d2 = moment('2016-10-10')
      .hours(4)
      .minutes(3)
      .seconds(2)
      .milliseconds(9);
    let result = isEqualTime([d1, d2]);
    assert.ok(result);
  });

  test('returns false for different times', function(assert) {
    let d1 = moment('2016-10-10')
      .hours(4)
      .minutes(3);
    let d2 = moment('2016-10-10')
      .hours(4)
      .minutes(2);
    let result = isEqualTime([d1, d2]);
    assert.notOk(result);

    d1 = moment('2016-10-10')
      .hours(5)
      .minutes(3);
    d2 = moment('2016-10-10')
      .hours(4)
      .minutes(3);
    result = isEqualTime([d1, d2]);
    assert.notOk(result);
  });
});
