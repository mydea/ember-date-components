import Component from '@glimmer/component';
import { action } from '@ember/object';
import moment from 'moment';

/**
 * Arguments:
 * - currentMonth
 * - minDate
 * - maxDate
 * - disableMonthPicker
 * - disableYearPicker
 * - availableYearOffset
 * - updateMonth
 */
export default class DatePickerMonthYearSelect extends Component {
  get availableMonths() {
    let { currentMonth, minDate, maxDate } = this.args;
    let year = currentMonth.year();

    minDate = minDate ? minDate.clone().startOf('month') : null;
    maxDate = maxDate ? maxDate.clone().startOf('month') : null;

    let months = [];
    for (let i = 0; i < 12; i++) {
      let date = moment().year(year).month(i).startOf('month');
      if (minDate && date.diff(minDate) < 0) {
        continue;
      }
      if (maxDate && date.diff(maxDate) > 0) {
        continue;
      }
      months.push(date);
    }

    return months;
  }

  get availableYears() {
    let { currentMonth, minDate, maxDate, availableYearOffset } = this.args;

    minDate = minDate ? minDate.clone().startOf('year') : null;
    maxDate = maxDate ? maxDate.clone().startOf('year') : null;

    let dates = [];
    for (let i = availableYearOffset; i > 0; i--) {
      let date = currentMonth.clone().subtract(i, 'years').startOf('month');
      if (minDate && date.diff(minDate) < 0) {
        continue;
      }
      if (maxDate && date.diff(maxDate) > 0) {
        continue;
      }
      dates.push(date);
    }
    dates.push(currentMonth.clone());
    for (let i = 1; i <= availableYearOffset; i++) {
      let date = currentMonth.clone().add(i, 'years').startOf('month');
      if (minDate && date.diff(minDate, 'years') < 0) {
        continue;
      }
      if (maxDate && date.diff(maxDate, 'years') > 0) {
        continue;
      }
      dates.push(date);
    }

    return dates;
  }

  get monthPickerDisabled() {
    return this.args.disableMonthPicker || !this.availableMonths.length;
  }

  get yearPickerDisabled() {
    return this.args.disableYearPicker || !this.availableYears.length;
  }

  @action
  gotoMonth(month, dropdownApi) {
    this.args.gotoMonth(month);

    dropdownApi?.actions.close();
  }
}
