import Component from '@ember/component';
import { computed, action } from '@ember/object';
import template from '../templates/components/date-picker-month-year-select';
import moment from 'moment';
import { layout } from '@ember-decorators/component';
import classic from 'ember-classic-decorator';

@layout(template)
@classic
export default class DatePickerMonthYearSelect extends Component {
  minDate = null;
  maxDate = null;
  currentMonth = null;
  disableYearPicker = false;
  disableMonthPicker = false;
  availableYearOffset = 10;

  @computed('currentMonth', 'minDate', 'maxDate')
  get availableMonths() {
    let { currentMonth, minDate, maxDate } = this;
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

  @computed('availableYearOffset', 'currentMonth', 'maxDate', 'minDate')
  get availableYears() {
    let { currentMonth, minDate, maxDate, availableYearOffset } = this;

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

  @computed('disableMonthPicker', 'availableMonths.length')
  get monthPickerDisabled() {
    return this.disableMonthPicker || !this.availableMonths.length;
  }

  @computed('disableYearPicker', 'availableYears.length')
  get yearPickerDisabled() {
    return this.disableYearPicker || !this.availableYears.length;
  }

  @action
  triggerGotoMonth(month, dropdownApi) {
    let action = this.gotoMonth;
    action(month);

    if (dropdownApi) {
      dropdownApi.actions.close();
    }
  }
}
