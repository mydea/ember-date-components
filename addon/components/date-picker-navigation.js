import Component from '@ember/component';
import layout from '../templates/components/date-picker-navigation';

export default Component.extend({
  layout,

  /**
   * The currently visible month.
   * This is set on initialisation. It is either the first selected date (if a value is provided), or today.
   *
   * @attribute currentMonth
   * @type {Date}
   * @private
   */
  currentMonth: null,

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
   * If set to true, the month picker will not be usable.
   *
   * @attribute disableMonthPicker
   * @type {Boolean}
   * @default false
   * @public
   */
  disableMonthPicker: false,

  /**
   * If set to true, the year picker will not be usable.
   *
   * @attribute disableYearPicker
   * @type {Boolean}
   * @default false
   * @public
   */
  disableYearPicker: false,

  /**
   * The number of years before & after the current year to show in the year picker.
   *
   * @attribute availableYearOffset
   * @type {Number}
   * @default 10
   * @public
   */
  availableYearOffset: 10,

  updateMonth: null,

  _sendAction(newMonth) {
    this.updateMonth(newMonth);
  },

  actions: {
    gotoNextMonth() {
      let month = this.currentMonth;
      this._sendAction(month.clone().add(1, 'month'));
    },

    gotoPreviousMonth() {
      let month = this.currentMonth;
      this._sendAction(month.clone().subtract(1, 'month'));
    },

    gotoMonth(month) {
      this._sendAction(month.clone().startOf('month'));
    },
  },
});
