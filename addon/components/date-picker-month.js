import Component from '@ember/component';
import { A as array } from '@ember/array';
import { computed, set, action } from '@ember/object';
import template from '../templates/components/date-picker-month';
import moment from 'moment';
import { layout, classNames } from '@ember-decorators/component';
import classic from 'ember-classic-decorator';

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
@layout(template)
@classNames('date-picker__calendar__outer')
@classic
export default class DatePickerMonth extends Component {
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
  selectedDates = null;

  /**
   * The month that should be shown.
   * If this is not set, it will default to the current month.
   *
   * @attribute month
   * @type {Date}
   * @optional
   * @public
   */
  month = null;

  /**
   * An array of optional dates to disable for this date picker.
   * These dates will not be selectable.
   *
   * @attribute disabledDates
   * @type {Date[]}
   * @optional
   * @public
   */
  disabledDates = null;

  /**
   * An optional minimum date.
   * No dates before this date will be selectable.
   *
   * @attribute minDate
   * @type {Date}
   * @optional
   * @public
   */
  minDate = null;

  /**
   * An optional maximum date.
   * No dates after this date will be selectable.
   *
   * @attribute maxDate
   * @type {Date}
   * @optional
   * @public
   */
  maxDate = null;

  /**
   * If weekdays (Mo, Tu, ...) should be shown in the calendar.
   *
   * @attribute showWeekdays
   * @type {Boolean}
   * @default true
   * @public
   */
  showWeekdays = true;

  /**
   * This action will receive the selected date as parameter.
   * It is called when a date is clicked.
   *
   * @event selectDate
   * @param {Date} date The selected date
   * @public
   */
  selectDate = null;

  // ATTRIBUTES END ----------------------------------------

  // PROPERTIES BEGIN ----------------------------------------

  /**
   * Internally, the minDate is copied, set to startOf('day') and saved here to save unnecessary processing.
   *
   * @property _minDate
   * @type {Date}
   * @private
   */
  @computed('minDate')
  get _minDate() {
    let { minDate } = this;
    return minDate ? minDate.clone().startOf('day') : null;
  }

  /**
   * Internally, the maxDate is copied, set to startOf('day') and saved here to save unnecessary processing.
   *
   * @property _maxDate
   * @type {Date}
   * @private
   */
  @computed('maxDate')
  get _maxDate() {
    let { maxDate } = this;
    return maxDate ? maxDate.clone().startOf('day') : null;
  }

  /**
   * This takes the given month and converts it to the beginning of the Date object.
   * If no month is given, it will default to the current month.
   *
   * @property currentMonth
   * @type {Date}
   * @private
   */
  @computed('month')
  get currentMonth() {
    let date = this.month;
    return date ? date.clone().startOf('month') : moment().startOf('month');
  }

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
  @computed('currentMonth', 'startWeekOnSunday')
  get _daysInMonth() {
    let { currentMonth, startWeekOnSunday } = this;
    let daysInMonth = currentMonth.daysInMonth();
    let days = array();

    // start with days from previous month to fill up first week
    let firstWeekday = startWeekOnSunday
      ? currentMonth.day() + 1
      : currentMonth.isoWeekday();

    for (let i = firstWeekday; i > 1; i--) {
      days.push({
        dateString: currentMonth
          .clone()
          .subtract(i, 'days')
          .format('YYYY-MM-DD'),
        show: false,
      });
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
        weekday: day.isoWeekday(),
        show: true,
      };

      days.push(dayObject);
    }

    // end with days from next month to fill up last week
    let endOfMonth = currentMonth.clone().endOf('month');
    let lastWeekday = startWeekOnSunday
      ? endOfMonth.day() + 1
      : endOfMonth.isoWeekday();
    for (let i = 7; i > lastWeekday; i--) {
      days.push({
        dateString: endOfMonth.clone().add(i, 'days').format('YYYY-MM-DD'),
        show: false,
      });
    }

    return days;
  }

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
  @computed(
    '_daysInMonth',
    'disabledDates.[]',
    '_minDate',
    '_maxDate',
    'selectedDates.[]'
  )
  get daysInMonth() {
    return this._daysInMonth.map((day) => {
      if (!day.show) {
        return day;
      }

      /* eslint-disable ember/no-side-effects */
      set(day, 'disabled', this._dayIsDisabled(day.date));
      set(day, 'inRange', this._dayIsInRange(day.date));
      /* eslint-enable ember/no-side-effects */

      return day;
    });
  }

  /**
   * The localized weekdays.
   *
   * @property weekdays
   * @type {String[]}
   * @readOnly
   * @private
   */
  @computed('startWeekOnSunday')
  get weekdays() {
    let weekdays = moment.weekdaysMin();
    let { startWeekOnSunday } = this;

    if (!startWeekOnSunday) {
      weekdays.push(weekdays.shift());
    }

    return weekdays;
  }

  /**
   * The current day.
   *
   * @property today
   * @type {Date}
   * @readOnly
   * @private
   */

  get today() {
    return moment().startOf('day');
  }

  // PROPERTIES END ----------------------------------------

  // HOOKS BEGIN ----------------------------------------

  init() {
    super.init(...arguments);

    if (!this.selectedDates) {
      set(this, 'selectedDates', []);
    }
  }

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
    let { _minDate, _maxDate } = this;
    if (_minDate && _minDate.valueOf() > day.valueOf()) {
      return true;
    } else if (_maxDate && _maxDate.valueOf() < day.valueOf()) {
      return true;
    } else {
      return this._dayNotAvailable(day);
    }
  }

  /**
   * Check if a date is disabled.
   * This checks if the date is inside of minDate/maxDate.
   *
   * @method _dayIsDisabled
   * @param {Date} day The date to check
   * @return {Boolean}
   * @private
   */
  _dayNotAvailable(day) {
    let disabledDates = this.disabledDates || [];
    return !!array(disabledDates).find((date) => date.isSame(day, 'day'));
  }

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
    let { selectedDates } = this;

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
  }

  @action
  triggerSelectDate(date) {
    let action = this.selectDate;
    if (action) {
      action(date);
    }
  }
}
