import { click, triggerKeyEvent, fillIn, find } from '@ember/test-helpers';
import moment from 'moment';
import { deprecate } from '@ember/application/deprecations';
import { assert } from '@ember/debug';

function isJQueryObject(el) {
  return el && typeof el.length !== 'undefined';
}

export function interactWithDatePicker(element) {
  let jqueryMode = isJQueryObject(element);
  let domElement = jqueryMode ? element.get(0) : element;
  let [button, buttonTo] = domElement.querySelectorAll('[data-test="date-picker-toggle-button"]');

  deprecate('Importing ember-date-components/helpers/interact-with-date-picker has been deprecated in favor of ember-date-components/test-support/date-picker', false, {
    id: 'ember-date-components.helpers.interactWithDatePicker',
    until: '2.0.0'
  });

  return {
    buttonText() {
      return button.innerText.trim();
    },

    toggle() {
      assert('button for interactWithDatePicker exists', !!button);
      return click(button);
    },

    toggleTo() {
      assert('buttonTo for interactWithDatePicker exists', !!buttonTo);
      return click(buttonTo);
    },

    select(date) {
      deprecate('For the interactWithDatePicker helper, use .selectDate() instead of .select(), which is async and will handle dates in different months.', false, {
        id: 'ember-date-components.interactWithDatePicker.select',
        until: '2.0.0'
      });
      return click(`.date-picker button[data-test="day-${date.month()}-${date.date()}"]`);
    },

    currentMonth() {
      let month = find('[data-test-date-picker-month]').getAttribute('data-test-date-picker-month');
      let year = find('[data-test-date-picker-year]').getAttribute('data-test-date-picker-year');
      return moment(`${year}-${month}-01`);
    },

    async selectDate(date) {
      let selector = `.date-picker button[data-test="day-${date.month()}-${date.date()}"]`;

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

    nextMonth() {
      return click('.date-picker .date-picker__header__button--next');
    },

    previousMonth() {
      return click('.date-picker .date-picker__header__button--previous');
    },

    isOpen() {
      return !!document.querySelector('.date-picker');
    },

    element,
    buttonElement: jqueryMode ? element.find(button) : button
  };
}

export async function setTimePickerValue(el, val) {
  let timeInput = el.querySelector('input');
  await fillIn(timeInput, val);
  await triggerKeyEvent(timeInput, 'keyup', 13); // Enter event
}

export default interactWithDatePicker;
