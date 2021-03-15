import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assert } from '@ember/debug';

/**
 * A date & time picker combo.
 * This uses date-picker & time-picker under the hood.
 *
 * Attributes:
 * - value
 * - datePickerClasses
 * - timePickerClasses
 * - buttonDateFormat
 * - amPm
 * - minDate
 * - maxDate
 * - minTime
 * - maxTime
 * - step
 * - selectStep
 * - disabled
 * - ignoreZeroTime
 * - renderInPlace
 * - horizontalPosition
 * - verticalPosition
 * - onChange
 */
export default class DateTimePicker extends Component {
  get timePickerDisabled() {
    return this.args.disabled || !this.args.value;
  }

  /**
   * The value for the time picker.
   * If ignoreZeroTime is true, and the time is 00:00, don't show a value in the select.
   * If this is not set, and a date is selected first, the time will jump to 00:00 immediately.
   */
  get timePickerValue() {
    let { value } = this.args;
    if (!this.ignoreZeroTime || !value) {
      return value;
    }

    // If the time === 00:00, do not enter it into the time picker
    if (value.hours() === 0 && value.minutes() === 0) {
      return null;
    }

    return value;
  }

  get ignoreZeroTime() {
    return typeof this.args.ignoreZeroTime === 'boolean'
      ? this.args.ignoreZeroTime
      : true;
  }

  constructor() {
    super(...arguments);

    assert(
      '<DateTimePicker>: You have to specify @onChange',
      typeof this.args.onChange === 'function'
    );
  }

  _sendAction(value) {
    this.args.onChange(value);
  }

  @action
  updateDate(val) {
    let oldDate = this.args.value;

    if (oldDate && val) {
      val.hours(oldDate.hours());
      val.minutes(oldDate.minutes());
      val.seconds(oldDate.seconds());
      val.milliseconds(oldDate.milliseconds());
    }

    this._sendAction(val);
  }

  @action
  updateTime(val) {
    let oldDate = this.args.value;

    if (oldDate && val) {
      val.year(oldDate.year());
      val.month(oldDate.month());
      val.date(oldDate.date());
    }

    this._sendAction(val);
  }
}
