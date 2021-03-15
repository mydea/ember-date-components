import Component from '@glimmer/component';
import { A as array } from '@ember/array';
import { typeOf as getTypeOf } from '@ember/utils';
import { next } from '@ember/runloop';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import moment from 'moment';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';

/**
 * A versatile date picker component.
 * This is 100% ember based and uses no other date picker library.
 *
 * Attributes:
 * - value
 * - disabledDates
 * - minDate
 * - maxDate
 * - range
 * - placeholder
 * - buttonClasses
 * - buttonDateFormat
 * - options
 * - disabled
 * - disableMonthPicker
 * - disableYearPicker
 * - availableYearOffset
 * - renderInPlace
 * - horizontalPosition
 * - verticalPosition
 * - startWeekOnSunday
 * - onChange
 * - onClose
 */

export default class DatePicker extends Component {
  @tracked dates;
  @tracked currentMonth;
  @tracked isToStep = false;
  @tracked isOpen = false;

  guid = guidFor(this);

  dateRangeSeparator = ' - ';
  _originallyFocusedElement;
  _datePickerDropdownElement;

  get range() {
    return this.args.range || false;
  }

  get placeholder() {
    return this.args.placeholder || 'Select date...';
  }

  get buttonDateFormat() {
    return this.args.buttonDateFormat || 'L';
  }

  get options() {
    return this.args.options || false;
  }

  get disabled() {
    return this.args.disabled || false;
  }

  get disableMonthPicker() {
    return this.args.disableMonthPicker || false;
  }

  get disableYearPicker() {
    return this.args.disableYearPicker || false;
  }

  get availableYearOffset() {
    return this.args.availableYearOffset || 10;
  }

  get startWeekOnSunday() {
    return this.args.startWeekOnSunday || false;
  }

  get buttonText() {
    let { range } = this;
    let vals = this.dates || array([]);
    let dateFormat = this.buttonDateFormat;

    let [dateFrom] = vals;

    if (!range) {
      if (!dateFrom) {
        return this.placeholder;
      }

      return dateFrom.format(dateFormat);
    }

    if (!dateFrom) {
      return this.placeholder;
    }

    return dateFrom.format(dateFormat);
  }

  get buttonToText() {
    let vals = this.dates || array([]);
    let dateFormat = this.buttonDateFormat;

    let [, dateTo] = vals;

    if (!dateTo) {
      return this.placeholder;
    }

    return dateTo.format(dateFormat);
  }

  get buttonFocused() {
    let { range: isRange, isOpen, isToStep } = this;

    return isRange ? isOpen && !isToStep : isOpen;
  }

  get buttonToFocused() {
    let { range: isRange, isOpen, isToStep } = this;

    return isRange ? isOpen && isToStep : false;
  }

  get selectedDates() {
    let arr = [];
    let [dateFrom, dateTo] = this.dates;
    if (dateFrom) {
      arr.push(dateFrom);
    }
    if (dateTo) {
      arr.push(dateTo);
    }
    return array(arr);
  }

  get availableOptions() {
    let { options, range: isRange, optionsMap } = this;

    if (!options) {
      return array();
    }

    // If options is true, return the default options depending on isRange
    if (getTypeOf(options) !== 'array') {
      options = isRange
        ? this._defaultDateRangeOptions
        : this._defaultDateOptions;
    }

    return options.map((option) => {
      return getTypeOf(option) === 'string' ? optionsMap[option] : option;
    });
  }

  get optionsMap() {
    return {
      clear: {
        action: 'clearDate',
        label: 'Clear',
      },
      today: {
        action: 'selectToday',
        label: 'Today',
      },
      last7Days: {
        action: 'selectDateRange',
        label: 'Last 7 days',
        actionValue: [
          moment().startOf('day').subtract(6, 'days'),
          moment().startOf('day'),
        ],
      },
      last30Days: {
        action: 'selectDateRange',
        label: 'Last 30 days',
        actionValue: [
          moment().startOf('day').subtract(29, 'days'),
          moment().startOf('day'),
        ],
      },
      lastYear: {
        action: 'selectDateRange',
        label: 'Last year',
        actionValue: [
          moment().startOf('day').subtract(1, 'year').add(1, 'day'),
          moment().startOf('day'),
        ],
      },
      last3Months: {
        action: 'selectDateRange',
        label: 'Last 3 months',
        actionValue: [
          moment().startOf('day').subtract(3, 'months').add(1, 'day'),
          moment().startOf('day'),
        ],
      },
      last6Months: {
        action: 'selectDateRange',
        label: 'Last 6 months',
        actionValue: [
          moment().startOf('day').subtract(6, 'months').add(1, 'day'),
          moment().startOf('day'),
        ],
      },
      thisWeek: {
        action: 'selectDateRange',
        label: 'This week',
        actionValue: [moment().startOf('isoweek'), moment().startOf('day')],
      },
      thisMonth: {
        action: 'selectDateRange',
        label: 'This month',
        actionValue: [moment().startOf('month'), moment().startOf('day')],
      },
    };
  }

  _defaultDateOptions = array(['clear', 'today']);

  _defaultDateRangeOptions = array([
    'clear',
    'today',
    'last7Days',
    'last30Days',
    'last3Months',
  ]);

  _dropdownApi = null;

  // PROPERTIES END ----------------------------------------

  constructor() {
    super(...arguments);

    assert(
      '<DatePicker>: You have to specify @onChange or @onClose',
      typeof this.args.onChange === 'function' ||
        typeof this.args.onClose === 'function'
    );

    this.valueDidUpdate();
  }

  @action
  valueDidUpdate() {
    let { value } = this.args;
    let { range } = this;

    let dates = array([]);

    if (value && getTypeOf(value) === 'array') {
      dates = value.slice();
    } else if (value) {
      dates = array([value]);
    }

    if (range && dates.length === 1) {
      this.isToStep = true;
    }

    while (range && dates.length < 2) {
      dates.push(null);
    }

    this._setCurrentMonth(dates);

    this.dates = dates;
  }

  @action
  selectOption(option) {
    let { action, actionValue } = option;

    console.log(action, actionValue);

    assert(
      `<DatePicker>: option has no valid action defined`,
      typeof this[action] === 'function'
    );

    this[action](actionValue);
  }

  _setCurrentMonth(dates) {
    let firstDate = dates.find((date) => date && moment.isMoment(date));

    this.currentMonth = firstDate
      ? firstDate.clone().startOf('month')
      : moment().startOf('month');
  }

  _sendOnChange() {
    if (!this.args.onChange || this.disabled) {
      return;
    }

    let value = this._getSelectedValue();
    this.args.onChange(value);
  }

  _sendOnClose() {
    if (!this.args.onClose || this.disabled) {
      return;
    }

    let value = this._getSelectedValue();
    this.args.onClose(value);
  }

  _open(forceOpenDropdown = true) {
    this.isOpen = true;

    if (forceOpenDropdown) {
      this._openDropdown();
    }
  }

  @action
  focusDatePicker(datePickerDropdown) {
    let originallyFocusedElement = document.activeElement;
    this._originallyFocusedElement = originallyFocusedElement;

    this._datePickerDropdownElement = datePickerDropdown;

    this._focusButtonInDatePicker();
  }

  _focusButtonInDatePicker() {
    let datePickerDropdown = this._datePickerDropdownElement;

    if (!datePickerDropdown) {
      return;
    }

    let selectedButton =
      datePickerDropdown &&
      datePickerDropdown.querySelector(
        '[data-date-picker-day].date-picker__day--selected'
      );
    let firstButton =
      datePickerDropdown &&
      datePickerDropdown.querySelector('[data-date-picker-day]');

    let buttonToFocus = selectedButton || firstButton;
    if (buttonToFocus && document.body.contains(buttonToFocus)) {
      buttonToFocus.focus();
    }
  }

  _resetFocus() {
    let originallyFocusedElement = this._originallyFocusedElement;
    this._originallyFocusedElement = undefined;

    if (
      originallyFocusedElement &&
      document.body.contains(originallyFocusedElement)
    ) {
      next(() => originallyFocusedElement.focus());
    }
  }

  _close(sendAction = true, forceCloseDropdown = true) {
    this.isOpen = false;
    this.isToStep = false;

    if (sendAction) {
      this._sendOnClose();
    }

    if (forceCloseDropdown) {
      this._closeDropdown();
      this._resetFocus();
    }
  }

  _getSelectedValue() {
    let value = this.range ? this.dates : this.dates[0];
    return value || null;
  }

  _closeDropdown() {
    this._dropdownApi?.actions.close();
  }

  _openDropdown() {
    this._dropdownApi?.actions.open();
  }

  _setSingleDate(date) {
    let dates = array([date]);
    this.dates = dates;

    this._sendOnChange();
    this._close();
  }

  _setFromDate(dateFrom) {
    let { dates } = this;
    let [, dateTo] = dates;

    if (dateFrom && dateTo && dateFrom.valueOf() > dateTo.valueOf()) {
      dateTo = null;
    }

    this.dates = array([dateFrom, dateTo]);
  }

  _setToDate(dateTo) {
    let { dates } = this;
    let [dateFrom] = dates;

    if (dateTo && dateFrom && dateTo.valueOf() < dateFrom.valueOf()) {
      [dateFrom, dateTo] = [dateTo, dateFrom];
    }

    if (dateTo) {
      dateTo = dateTo.endOf('day');
    }

    this.dates = array([dateFrom, dateTo]);
  }

  _setDateRange(date) {
    let { isToStep } = this;

    if (!isToStep) {
      this._setFromDate(date);
      this._moveToToStep();
      this._sendOnChange();
    } else {
      this._setToDate(date);
      this._sendOnChange();
      this._close();
    }
  }

  _moveToFromStep() {
    let [month] = this.dates;

    if (month) {
      this.currentMonth = month.clone().startOf('month');
    }

    this.isToStep = false;

    this._openDropdown();
    this._focusButtonInDatePicker();
  }

  _moveToToStep() {
    let [, month] = this.dates;

    if (month) {
      this.currentMonth = month.clone().startOf('month');
    }

    this.isToStep = true;

    this._openDropdown();

    this._focusButtonInDatePicker();
  }

  _openFromDate() {
    this._moveToFromStep();
    this._open();
  }

  _openToDate() {
    this._moveToToStep();
    this._open();
  }

  // METHODS END ----------------------------------------

  // ACTIONS BEGIN ----------------------------------------

  @action
  clearDate() {
    this.dates = this.range ? array([null, null]) : array([]);
    this.isToStep = false;

    this._sendOnChange();
    this._close();
  }

  @action
  selectToday() {
    let today = moment().startOf('day');

    this.dates = this.range ? array([today, today]) : array([today]);

    this._sendOnChange();
    this._close();
  }

  @action
  toggleOpen(dd, event) {
    let { isOpen, range, isToStep } = this;

    event.preventDefault();

    if (!isOpen) {
      this._openFromDate();
      return;
    }

    // SINGLE
    if (!range) {
      this._close();
      return;
    }

    // RANGE
    if (isToStep) {
      this._moveToFromStep();
    } else {
      this._close();
    }
  }

  @action
  toggleOpenTo(dd, event) {
    let { isOpen, isToStep } = this;

    event.preventDefault();

    if (!isOpen) {
      this._openToDate();
      return;
    }

    if (!isToStep) {
      this._moveToToStep();
    } else {
      this._close();
    }
  }

  @action
  gotoMonth(month) {
    this.currentMonth = month;
  }

  @action
  selectDate(date) {
    let { range } = this;

    if (!range) {
      this._setSingleDate(date);
    } else {
      this._setDateRange(date);
    }
  }

  // For options only
  selectDateRange(dateRange) {
    this.dates = array(dateRange);

    this._sendOnChange();
    this._close();
  }

  @action
  async onDropdownClosed() {
    // Ensure it is set to closed when clicking the dropdown with outside click
    await new Promise((resolve) => setTimeout(resolve, 1));

    if (this.isOpen) {
      this._close(true, false);
    }
  }

  @action
  onDropdownOpened(dropdownApi) {
    this._dropdownApi = dropdownApi;
  }

  // ACTIONS END ----------------------------------------
}
