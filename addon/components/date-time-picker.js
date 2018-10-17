import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import layout from '../templates/components/date-time-picker';
import { shouldUseAmPm } from 'ember-date-components/utils/should-use-am-pm';

/**
 * A date & time picker combo.
 * This uses date-picker & time-picker under the hood.
 *
 * @namespace EmberDateComponents
 * @class DateTimePicker
 * @extends Ember.Component
 * @public
 */
export default Component.extend({

  layout,
  classNames: ['date-time-picker'],

  /**
   * The currently selected value.
   * This should be a moment.js instance.
   *
   * @attribute value
   * @type {Date}
   * @public
   */
  value: null,

  /**
   * Classes which should be added to the date picker button.
   *
   * @attribute datePickerClasses
   * @type {String}
   * @public
   */
  datePickerClasses: '',

  /**
   * Classes which should be added to the time input.
   *
   * @attribute timePickerClasses
   * @type {String}
   * @public
   */
  timePickerClasses: '',

  /**
   * The date format which should be used for the button.
   * Defaults to localized 'L'.
   *
   * @attribute buttonDateFormat
   * @type {String}
   * @default 'L'
   * @public
   */
  buttonDateFormat: 'L',

  /**
   * If the display format should use am/pm or the 24:00 format.
   * By default, this will be determined by checking the localized date formatting of moment.js.
   * However, if you don't use moment.js-locales, this will always return true (because the default locale, 'en', uses am/pm).
   * In such a case, you can just overwrite this.
   *
   * @attribute amPm
   * @type {Boolean}
   * @public
   */
  amPm: computed(function() {
    return shouldUseAmPm();
  }),

  /**
   * An optional minimum date for this date picker.
   * No dates before this date will be selectable.
   *
   * @attribute minDate
   * @type {Date}
   * @optional
   * @public
   */
  minDate: null,

  /**
   * An optional maximum date for this date picker.
   * No dates after this date will be selectable.
   *
   * @attribute masDate
   * @type {Date}
   * @optional
   * @public
   */
  maxDate: null,

  /**
   * The minimum time which can be selected.
   * This should be either a parseable string or a moment.js object.
   *
   * @attribute minTime
   * @type {String|Object}
   * @default '00:00'
   * @public
   */
  minTime: '00:00',

  /**
   * The maximum time which can be selected.
   * This should be either a parseable string or a moment.js object.
   *
   * @attribute minTime
   * @type {String|Object}
   * @default '23:59'
   * @public
   */
  maxTime: '23:59',

  /**
   * The step in minutes which can be selected.
   * Entered times will be rounded to this accuracy.
   * If you don't specify a selectStep separately, this value will also be used as selectStep.
   *
   * @attribute step
   * @type {Number}
   * @default 30
   * @public
   */
  step: 1,

  /**
   * The step from which dates can be selected in the dropdown.
   * If this is not explicitly set, step will be used for this value as well.
   * However, if values like 22:14 should be allowed but not shown in the dropdown,
   * this can be set to a different value.
   *
   * @attribute selectStep
   * @type {Number}
   * @default 30
   * @public
   */
  selectStep: 30,

  /**
   * If this is true, the date/time picker is disabled and the selected date cannot be changed.
   *
   * @attribute disabled
   * @type {Boolean}
   * @default false
   * @public
   */
  disabled: false,

  /**
   * If ignoreZeroTime is true, and the time is 00:00, don't show a value in the select.
   * If this is not set, and a date is selected first, the time will jump to 00:00 immediately.
   * Note that this only affects the display of the time, not the value itself.
   *
   * @attribute ignoreZeroTime
   * @type {Boolean}
   * @default true
   * @public
   */
  ignoreZeroTime: true,

  /**
   * Value passed to `ember-basic-dropdown`
   *
   * @attribute value
   * @type {Boolean}
   * @public
   */
  renderInPlace: false,

  /**
   * Value passed to `ember-basic-dropdown`
   *
   * Available values are right|center|left
   *
   * @attribute value
   * @type {String}
   * @public
   */
  horizontalPosition: 'auto',

  /**
   * Value passed to `ember-basic-dropdown`
   *
   * Available values are above|below
   *
   * @attribute value
   * @type {String}
   * @public
   */
  verticalPosition: 'auto',

  /**
   * The action to call when the date/time updates.
   *
   * @event action
   * @param {Date} newDate
   * @public
   */
  action: null,

  /**
   * The internal value.
   *
   * @property _value
   * @type {Date}
   * @protected
   */
  _value: null,

  /**
   * You can only enter a time once a date is selected.
   *
   * @property timePickerDisabled
   * @type {Boolean}
   * @readOnly
   * @protected
   */
  timePickerDisabled: computed('disabled', 'value', function() {
    return get(this, 'disabled') || !get(this, 'value');
  }),

  /**
   * The value for the time picker.
   * If ignoreZeroTime is true, and the time is 00:00, don't show a value in the select.
   * If this is not set, and a date is selected first, the time will jump to 00:00 immediately.
   *
   * @property timePickerValue
   * @type {Date}
   * @readOnly
   * @protected
   */
  timePickerValue: computed('ignoreZeroTime', 'value', function() {
    let value = get(this, 'value');
    if (!get(this, 'ignoreZeroTime') || !value) {
      return value;
    }

    // If the time === 00:00, do not enter it into the time picker
    if (value.hours() === 0 && value.minutes() === 0) {
      return null;
    }
    return value;
  }),

  /**
   * Send the update action.
   *
   * @method _sendAction
   * @private
   */
  _sendAction() {
    let value = get(this, '_value');
    let action = get(this, 'action');

    return action(value);
  },

  didReceiveAttrs() {
    set(this, '_value', get(this, 'value'));
  },

  actions: {
    updateDate(val) {
      let oldDate = get(this, '_value');
      if (oldDate && val) {
        val.hours(oldDate.hours());
        val.minutes(oldDate.minutes());
        val.seconds(oldDate.seconds());
        val.milliseconds(oldDate.milliseconds());
      }

      set(this, '_value', val);
      this._sendAction();
    },

    updateTime(val) {
      let oldDate = get(this, '_value');

      if (oldDate && val) {
        val.year(oldDate.year());
        val.month(oldDate.month());
        val.date(oldDate.date());
      }

      set(this, '_value', val);
      this._sendAction();
    }
  }
});
