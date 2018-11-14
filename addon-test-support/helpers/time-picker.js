import { click, triggerKeyEvent, fillIn, find } from '@ember/test-helpers';
import moment from 'moment';
import { assert } from '@ember/debug';
import parseTime from 'ember-date-components/utils/parse-time';

export async function selectTime(element, val) {
  if (typeof element === 'string') {
    element = find(element);
  }

  assert(
    'selectTime is passed a DOM node or a matching selector string',
    !!element
  );

  let timePickerButton = element.hasAttribute('data-time-picker-toggle-button')
    ? element
    : element.querySelector('[data-time-picker-toggle-button]');

  let elementId = timePickerButton.getAttribute(
    'data-time-picker-toggle-button'
  );

  await click(timePickerButton);

  if (moment.isMoment(val)) {
    val = val.format('HH:mm');
  }

  let timeInput = find(`[data-time-picker-input-instance="${elementId}"]`);
  await fillIn(timeInput, val);
  await triggerKeyEvent(timeInput, 'keydown', 'Enter'); // Enter event
}

export function getSelectedTime(element) {
  if (typeof element === 'string') {
    element = find(element);
  }

  assert(
    'getSelectedTime is passed a DOM node or a matching selector string',
    !!element
  );

  let timePickerButton = element.hasAttribute('data-time-picker-toggle-button')
    ? element
    : element.querySelector('[data-time-picker-toggle-button]');

  let timeValue = timePickerButton.getAttribute('data-time-picker-value');
  return timeValue ? parseTime(timeValue) : null;
}

export default {
  selectTime,
  getSelectedTime
};
