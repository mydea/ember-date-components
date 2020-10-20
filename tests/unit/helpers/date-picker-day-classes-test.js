import { datePickerDayClasses } from 'dummy/helpers/date-picker-day-classes';
import { module, test } from 'qunit';

module('Unit | Helper | date picker day classes', function () {
  test('default settings work', function (assert) {
    let baseClass = 'base';
    let options = {};
    let result = datePickerDayClasses([baseClass], options);
    assert.equal(result, 'base');
  });

  test('all settings work together', function (assert) {
    let baseClass = 'base';
    let options = {
      isToday: true,
      isSelected: true,
      isDisabled: true,
      isInRange: true,
    };
    let result = datePickerDayClasses([baseClass], options);
    assert.equal(
      result,
      'base base--today base--selected base--disabled base--in-range'
    );
  });

  test('skipped settings default to false', function (assert) {
    let baseClass = 'base';
    let options = {
      isDisabled: true,
    };
    let result = datePickerDayClasses([baseClass], options);
    assert.equal(result, 'base base--disabled');
  });
});
