import { click, find } from '@ember/test-helpers';
import moment from 'moment';
import { assert, deprecate } from '@ember/debug';
import { selectTime } from './time-picker';

export function getDatePicker(element) {
  if (typeof element === 'string') {
    element = find(element);
  }

  assert(
    'getDatePicker is passed a DOM node or a matching selector string',
    !!element
  );
  assert(
    'getDatePicker does not support jQuery elements, only plain DOM nodes or a text selector',
    typeof element.length === 'undefined'
  );

  let [button, buttonTo] = element.querySelectorAll(
    '[data-test-date-picker-toggle-button]'
  );

  return {
    buttonText() {
      return button.innerText.trim();
    },

    buttonToText() {
      return buttonTo.innerText.trim();
    },

    toggle() {
      assert('button for getDatePicker exists', !!button);
      return click(button);
    },

    toggleTo() {
      assert('buttonTo for getDatePicker exists', !!buttonTo);
      return click(buttonTo);
    },

    currentMonth() {
      let month = find('[data-test-date-picker-month]').getAttribute(
        'data-test-date-picker-month'
      );
      let year = find('[data-test-date-picker-year]').getAttribute(
        'data-test-date-picker-year'
      );
      return moment(`${year}-${month}-01`);
    },

    async selectDate(date) {
      // Auto-open if not open
      if (!this.isOpen()) {
        await this.toggle();
      }

      let selector = `[data-test-date-picker-day="${date.year()}-${date.month()}-${date.date()}"]`;

      if (!find(selector)) {
        let dateMonth = date.clone().startOf('month');
        // Try to auto-move towards the given date
        while (this.currentMonth().isBefore(dateMonth, 'month')) {
          await this.nextMonth();
        }
        while (this.currentMonth().isAfter(dateMonth, 'month')) {
          await this.previousMonth();
        }
      }

      return click(selector);
    },

    async selectDateRange(dateFrom, dateTo) {
      // Auto-open if not open
      if (!this.isOpen()) {
        await this.toggle();
      }

      await this.selectDate(dateFrom);
      await this.selectDate(dateTo);
    },

    nextMonth() {
      return click('[data-test-date-picker-goto-next-month]');
    },

    previousMonth() {
      return click('[data-test-date-picker-goto-previous-month]');
    },

    isOpen() {
      return !!find('[data-test-date-picker-days]');
    },

    element,
    buttonElement: button,
    buttonToElement: buttonTo,
  };
}

export async function setTimePickerValue() {
  deprecate(
    '`setTimePickerValue` test helper has been deprecated in favor of `import { selectTime } from "ember-date-components/test-support/helpers/time-picker"`, please use it instead.',
    false,
    {
      id: 'ember-date-components.test-support.helpers.date-picker',
      until: '3.0.0',
    }
  );

  return selectTime(...arguments);
}

export async function selectDate(element, date) {
  assert('date must be moment.js object', moment.isMoment(date));

  let datePicker = await getDatePicker(element);
  await datePicker.selectDate(date);
}

export async function selectDateRange(element, dateFrom, dateTo) {
  assert('dateFrom must be moment.js object', moment.isMoment(dateFrom));
  assert('dateTo must be moment.js object', moment.isMoment(dateTo));

  let datePicker = await getDatePicker(element);
  await datePicker.selectDateRange(dateFrom, dateTo);
}

export async function getSelectedDate(element) {
  let datePicker = await getDatePicker(element);
  let button = datePicker.buttonElement;
  let buttonTo = datePicker.buttonToElement;
  let format = button.getAttribute(
    'data-test-date-picker-toggle-button-format'
  );

  let value = button.innerText.trim();
  let dateFrom = value ? moment(value, format) : null;

  if (dateFrom && !dateFrom.isValid()) {
    dateFrom = null;
  }

  if (buttonTo) {
    let valueTo = buttonTo.innerText.trim();
    let dateTo = valueTo ? moment(valueTo, format) : null;
    if (dateTo && !dateTo.isValid()) {
      dateTo = null;
    }
    return [dateFrom, dateTo];
  }

  return dateFrom;
}

export async function selectDateTime(element, date) {
  assert('date must be moment.js object', moment.isMoment(date));

  await selectDate(element, date);
  await selectTime(element, date);
}

export default getDatePicker;
