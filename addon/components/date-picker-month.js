import Component from '@ember/component';
import { A as array } from '@ember/array';
import { computed, getProperties, set, get } from '@ember/object';
import layout from '../templates/components/date-picker-month';
import moment from 'moment';

/**
 * A single month view.
 * This is used internally by the date-picker.
 * It is stand alone and could also be used without it.
 *
 * @namespace EmberDateComponents
 * @class DatePickerMonth
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  layout,
  classNames: ['date-picker__calendar__outer'],

  // ATTRIBUTES BEGIN ----------------------------------------

  /**
   * The selected dates for the date picker.
   * This has to be an array with 0-2 elements. If it has 2 elements, it will show the range between the two.
   *
   * @attributes selectedDates
   * @type {Date[]}
   * @optional
   * @public
   */
  selectedDates: null,

  /**
   * The month that should be shown.
   * If this is not set, it will default to the current month.
   *
   * @attribute month
   * @type {Date}
   * @optional
   * @public
   */
  month: null,

  /**
   * An optional minimum date.
   * No dates before this date will be selectable.
   *
   * @attribute minDate
   * @type {Date}
   * @optional
   * @public
   */
  minDate: null,

  /**
   * An optional maximum date.
   * No dates after this date will be selectable.
   *
   * @attribute maxDate
   * @type {Date}
   * @optional
   * @public
   */
  maxDate: null,

  /**
   * If weekdays (Mo, Tu, ...) should be shown in the calendar.
   *
   * @attribute showWeekdays
   * @type {Boolean}
   * @default true
   * @public
   */
  showWeekdays: true,

  /**
   * This action will receive the selected date as parameter.
   * It is called when a date is clicked.
   *
   * @event selectDate
   * @param {Date} date The selected date
   * @public
   */
  selectDate: null,

  // ATTRIBUTES END ----------------------------------------

  // PROPERTIES BEGIN ----------------------------------------

  /**
   * Internally, the minDate is copied, set to startOf('day') and saved here to save unnecessary processing.
   *
   * @property _minDate
   * @type {Date}
   * @private
   */
  _minDate: null,

  /**
   * Internally, the maxDate is copied, set to startOf('day') and saved here to save unnecessary processing.
   *
   * @property _maxDate
   * @type {Date}
   * @private
   */
  _maxDate: null,

  /**
   * This takes the given month and converts it to the beginning of the Date object.
   * If no month is given, it will default to the current month.
   *
   * @property currentMonth
   * @type {Date}
   * @private
   */
  currentMonth: computed('month', function() {
    let date = get(this, 'month');
    return date ? date.clone().startOf('month') : moment().startOf('month');
  }),

  /**
   * The currently displayed days in the calendar.
   * This will contain all the days of the current month,
   * prepended with days to fill a started week in the beginning of the month,
   * appended with days to fill a started week in the end of the month.
   * This means that the array length will always be divisible by 7.
   * The generated objects contain the reference to the used date, as well as various other pieces of information:
   *
   * ```js
   * {
   *    date: day,
   *    dateString: day.format('YYYY-MM-DD'),
   *    year: day.year(),
   *    month: day.month(),
   *    day: day.date(),
   *    weekday: day.isoWeekday(),
   *    disabled: this._dayIsDisabled(day),
   *    notInCurrentMonth: true
   * }
   * ```
   *
   * @property _daysInMonth
   * @type {Object[]}
   * @readOnly
   * @private
   */
  _daysInMonth: computed('currentMonth', function() {
    let currentMonth = get(this, 'currentMonth');
    let startWeekOnSunday = get(this, 'startWeekOnSunday');
    let daysInMonth = currentMonth.daysInMonth();
    let days = array();

    // start with days from previous month to fill up first week
    let firstWeekday = startWeekOnSunday ? currentMonth.day() + 1 : currentMonth.isoWeekday();
    for (let i = firstWeekday; i > 1; i--) {
      days.push(null);
    }

    // create one day object for every day in the month
    for (let i = 0; i < daysInMonth; i++) {
      let day = currentMonth.clone().add(i, 'days');
      let dayObject = {
        date: day,
        dateString: day.format('YYYY-MM-DD'),
        year: day.year(),
        month: day.month(),
        day: day.date(),
        weekday: day.isoWeekday()
      };

      days.push(dayObject);
    }

    // end with days from next month to fill up last week
    let endOfMonth = currentMonth.clone().endOf('month');
    let lastWeekday = startWeekOnSunday ? endOfMonth.day() + 1 : endOfMonth.isoWeekday();
    for (let i = 7; i > lastWeekday; i--) {
      days.push(null);
    }

    return days;
  }),

  /**
   * This takes the generated _daysInMonth and parses the days.
   * It will set disabled and inRange accordingly for all days.
   * Note that for performance reasons, this will mutate the original array instead of creating a new one.
   *
   * @property daysInMonth
   * @type {Object[]}
   * @readOnly
   * @private
   */
  daysInMonth: computed('_daysInMonth', '_minDate', '_maxDate', 'selectedDates.[]', function() {
    let days = get(this, '_daysInMonth');

    days.forEach((day) => {
      if (!day) {
        return;
      }
      set(day, 'disabled', this._dayIsDisabled(day.date));
      set(day, 'inRange', this._dayIsInRange(day.date));
    });

    return days;
  }),

  /**
   * The localized weekdays.
   *
   * @property weekdays
   * @type {String[]}
   * @readOnly
   * @private
   */
  weekdays: computed(function() {
    let weekdays = moment.weekdaysMin();
    let startWeekOnSunday = get(this, 'startWeekOnSunday');

    if (!startWeekOnSunday) {
      weekdays.push(weekdays.shift());
    }

    return weekdays;
  }),

  /**
   * The current day.
   *
   * @property today
   * @type {Date}
   * @readOnly
   * @private
   */
  today: computed(function() {
    return moment().startOf('day');
  }),

  // PROPERTIES END ----------------------------------------

  // HOOKS BEGIN ----------------------------------------

  didReceiveAttrs() {
    this._super(...arguments);

    let minDate = get(this, 'minDate');
    let maxDate = get(this, 'maxDate');

    set(this, '_minDate', minDate ? minDate.clone().startOf('day') : null);
    set(this, '_maxDate', maxDate ? maxDate.clone().startOf('day') : null);
  },

  init() {
    this._super(...arguments);
    set(this, 'selectedDates', []);
  },

  // HOOKS END ----------------------------------------

  // METHODS BEGIN ----------------------------------------

  /**
   * Check if a date is disabled.
   * This checks if the date is inside of minDate/maxDate.
   *
   * @method _dayIsDisabled
   * @param {Date} day The date to check
   * @return {Boolean}
   * @private
   */
  _dayIsDisabled(day) {
    let {
      _minDate,
      _maxDate
    } = getProperties(this, '_minDate', '_maxDate');

    if (_minDate && _minDate.valueOf() > day.valueOf()) {
      return true;
    }
    return _maxDate && _maxDate.valueOf() < day.valueOf();
  },

  /**
   * Check if a day is in the range of the selectedDates.
   * If selectedDates does not consist of two dates, this will always return false.
   *
   * @method _dayIsInRange
   * @param {Object} day
   * @return {Boolean}
   * @private
   */
  _dayIsInRange(day) {
    let selectedDates = get(this, 'selectedDates');

    if (!selectedDates || !selectedDates.length || selectedDates.length < 2) {
      return false;
    }

    let selectedDateVal = selectedDates[0].clone().startOf('day').valueOf();
    let selectedUntilVal = selectedDates[1].clone().startOf('day').valueOf();
    let dayVal = day.valueOf();

    if (selectedDateVal > selectedUntilVal) {
      return dayVal > selectedUntilVal && dayVal < selectedDateVal;
    } else {
      return dayVal < selectedUntilVal && dayVal > selectedDateVal;
    }
  },

  actions: {
    selectDate(date) {
      let action = get(this, 'attrs.selectDate');
      if (action) {
        action(date);
      }
    }
  }
});
