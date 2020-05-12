import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../templates/components/date-picker-month-year-select';
import moment from 'moment';

export default Component.extend({
  layout,

  minDate: null,
  maxDate: null,
  currentMonth: null,
  disableYearPicker: false,
  disableMonthPicker: false,
  availableYearOffset: 10,

  availableMonths: computed('currentMonth', 'minDate', 'maxDate', function() {
    let { currentMonth, minDate, maxDate } = this;
    let year = currentMonth.year();

    minDate = minDate ? minDate.clone().startOf('month') : null;
    maxDate = maxDate ? maxDate.clone().startOf('month') : null;

    let months = [];
    for (let i = 0; i < 12; i++) {
      let date = moment()
        .year(year)
        .month(i)
        .startOf('month');
      if (minDate && date.diff(minDate) < 0) {
        continue;
      }
      if (maxDate && date.diff(maxDate) > 0) {
        continue;
      }
      months.push(date);
    }

    return months;
  }),

  availableYears: computed(
    'availableYearOffset',
    'currentMonth',
    'maxDate',
    'minDate',
    function() {
      let { currentMonth, minDate, maxDate, availableYearOffset } = this;

      minDate = minDate ? minDate.clone().startOf('year') : null;
      maxDate = maxDate ? maxDate.clone().startOf('year') : null;

      let dates = [];
      for (let i = availableYearOffset; i > 0; i--) {
        let date = currentMonth
          .clone()
          .subtract(i, 'years')
          .startOf('month');
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
        let date = currentMonth
          .clone()
          .add(i, 'years')
          .startOf('month');
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
  ),

  monthPickerDisabled: computed(
    'disableMonthPicker',
    'availableMonths.length',
    function() {
      return this.disableMonthPicker || !this.availableMonths.length;
    }
  ),

  yearPickerDisabled: computed(
    'disableYearPicker',
    'availableYears.length',
    function() {
      return this.disableYearPicker || !this.availableYears.length;
    }
  ),

  actions: {
    gotoMonth(month, dropdownApi) {
      let action = this.gotoMonth;
      action(month);

      if (dropdownApi) {
        dropdownApi.actions.close();
      }
    }
  }
});
