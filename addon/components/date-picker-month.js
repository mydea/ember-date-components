import Ember from 'ember';
import layout from '../templates/components/date-picker-month';
import moment from 'moment';

const { get, set, computed, getProperties } = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['date-picker__calendar__outer'],

  showWeekdays: true,

  selectedDates: [],

  month: null,

  minDate: null,

  maxDate: null,

  _minDate: null,

  _maxDate: null,

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
   * @property daysInMonth
   * @type {Object[]}
   * @readOnly
   * @private
   */
  _daysInMonth: computed('currentMonth', function() {
    let currentMonth = get(this, 'currentMonth');
    let daysInMonth = currentMonth.daysInMonth();
    let days = Ember.A();

    // start with days from previous month to fill up first week
    let firstWeekday = currentMonth.isoWeekday();
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
    let lastWeekday = currentMonth.clone().endOf('month').isoWeekday();
    for (let i = 1; i <= 7 - lastWeekday; i++) {
      days.push(null);
    }

    return days;
  }),

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
   * The localized weekdays, starting with monday.
   *
   * @property weekdays
   * @type {String[]}
   * @readOnly
   * @private
   */
  weekdays: computed(function() {
    let weekdays = moment.weekdaysMin();
    weekdays.push(weekdays.shift());
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

  // HOOKS BEGIN ----------------------------------------

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

  didReceiveAttrs() {
    let minDate = get(this, 'minDate');
    let maxDate = get(this, 'maxDate');

    set(this, '_minDate', minDate ? minDate.clone().startOf('day') : null);
    set(this, '_maxDate', maxDate ? maxDate.clone().startOf('day') : null);
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
