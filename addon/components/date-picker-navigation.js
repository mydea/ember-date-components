import Component from '@glimmer/component';
import { action } from '@ember/object';

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
export default class DatePickerNavigation extends Component {
  get availableYearOffset() {
    return this.args.availableYearOffset || 10;
  }

  @action
  gotoNextMonth() {
    let month = this.args.currentMonth;
    this._sendAction(month.clone().add(1, 'month'));
  }

  @action
  gotoPreviousMonth() {
    let month = this.args.currentMonth;
    this._sendAction(month.clone().subtract(1, 'month'));
  }

  @action
  gotoMonth(month) {
    this._sendAction(month.clone().startOf('month'));
  }

  _sendAction(newMonth) {
    this.args.updateMonth(newMonth);
  }
}
