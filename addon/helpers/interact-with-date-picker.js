import { click, triggerKeyEvent, fillIn } from '@ember/test-helpers';

function isJQueryObject(el) {
  return el && typeof el.length !== 'undefined';
}

export function interactWithDatePicker(element) {
  let jqueryMode = isJQueryObject(element);
  let domElement = jqueryMode ? element.get(0) : element;
  let [button, buttonTo] = domElement.querySelectorAll('[data-test="date-picker-toggle-button"]');

  return {
    buttonText() {
      return button.innerText.trim();
    },

    toggle() {
      return click(button);
    },

    toggleTo() {
      return click(buttonTo);
    },

    select(date) {
      return click(`.date-picker button[data-test="day-${date.month()}-${date.date()}"]`);
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
