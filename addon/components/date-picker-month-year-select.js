import Component from '@ember/component';
import { computed, get } from '@ember/object';
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
    let currentMonth = get(this, 'currentMonth');
    let year = currentMonth.year();

    let minDate = get(this, 'minDate');
    let maxDate = get(this, 'maxDate');

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

  availableYears: computed('currentMonth', 'minDate', 'maxDate', function() {
    let currentMonth = get(this, 'currentMonth');

    let minDate = get(this, 'minDate');
    let maxDate = get(this, 'maxDate');

    minDate = minDate ? minDate.clone().startOf('year') : null;
    maxDate = maxDate ? maxDate.clone().startOf('year') : null;

    let availableYearOffset = get(this, 'availableYearOffset');
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
  }),

  monthPickerDisabled: computed(
    'disableMonthPicker',
    'availableMonths.length',
    function() {
      return (
        get(this, 'disableMonthPicker') || !get(this, 'availableMonths.length')
      );
    }
  ),

  yearPickerDisabled: computed(
    'disableYearPicker',
    'availableYears.length',
    function() {
      return (
        get(this, 'disableYearPicker') || !get(this, 'availableYears.length')
      );
    }
  ),

  actions: {
    gotoMonth(month, dropdownApi) {
      let action = get(this, 'gotoMonth');
      action(month);

      if (dropdownApi) {
        dropdownApi.actions.close();
      }
    }
  }
});
