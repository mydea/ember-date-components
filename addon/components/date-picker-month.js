import Component from '@glimmer/component';
import { A as array } from '@ember/array';
import { action } from '@ember/object';
import moment from 'moment';
import { cached, tracked } from '@glimmer/tracking';

/**
 * A single month view.
 * This is used internally by the date-picker.
 * It is stand alone and could also be used without it.
 *
 * Attributes:
 * - selectedDates
 * - month
 * - disabledDates
 * - minDate
 * - maxDate
 * - showWeekdays
 * - selectDate
 * - startWeekOnSunday
 */
export default class DatePickerMonth extends Component {
  @tracked _selectedDates = undefined;

  get selectedDates() {
    if (this._selectedDates) {
      return this._selectedDates;
    }

    return this.args.selectedDates || [];
  }

  get showWeekdays() {
    return typeof this.args.showWeekdays === 'boolean'
      ? this.args.showWeekdays
      : true;
  }

  get minDate() {
    let { minDate } = this.args;
    return minDate ? minDate.clone().startOf('day') : null;
  }

  get maxDate() {
    let { maxDate } = this.args;
    return maxDate ? maxDate.clone().startOf('day') : null;
  }

  get currentMonth() {
    let { month } = this.args;
    return month ? month.clone().startOf('month') : moment().startOf('month');
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
   */
  @cached
  get _daysInMonth() {
    let { startWeekOnSunday } = this.args;
    let { currentMonth } = this;
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

  get daysInMonth() {
    return this._daysInMonth.map((day) => {
      if (!day.show) {
        return day;
      }

      return Object.assign({}, day, {
        disabled: this._dayIsDisabled(day.date),
        inRange: this._dayIsInRange(day.date),
      });
    });
  }

  get weekdays() {
    let weekdays = moment.weekdaysMin();
    let { startWeekOnSunday } = this.args;

    if (!startWeekOnSunday) {
      weekdays.push(weekdays.shift());
    }

    return weekdays;
  }

  get today() {
    return moment().startOf('day');
  }

  // PROPERTIES END ----------------------------------------

  // METHODS BEGIN ----------------------------------------

  _dayIsDisabled(day) {
    let { minDate, maxDate } = this;
    if (minDate && minDate.valueOf() > day.valueOf()) {
      return true;
    } else if (maxDate && maxDate.valueOf() < day.valueOf()) {
      return true;
    } else {
      return this._dayNotAvailable(day);
    }
  }

  _dayNotAvailable(day) {
    let disabledDates = this.args.disabledDates || [];
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
  selectDate(date) {
    this.args.selectDate(date);
  }
}
