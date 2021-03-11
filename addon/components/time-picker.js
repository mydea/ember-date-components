import Component from '@glimmer/component';
import { action } from '@ember/object';
import moment from 'moment';
import parseTime from 'ember-date-components/utils/parse-time';
import buildTimeRange from 'ember-date-components/utils/build-time-range';
import { shouldUseAmPm } from 'ember-date-components/utils/should-use-am-pm';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

/**
 * An input field to choose a time in a day.
 * The user can either enter a time directly, or choose from a list.
 *
 * Arguments:
 * - value
 * - disabled
 * - onChange
 * - placeholder
 * - amPm
 * - minTime
 * - maxTime
 * - step
 * - selectStep
 * - inputClasses
 * - renderInPlace
 * - horizontalPosition
 * - verticalPosition
 * - matchTriggerWidth
 * - dropdownClasses
 * - buttonClasses
 */
export default class TimePicker extends Component {
  guid = guidFor(this);

  @tracked inputValue = null;
  @tracked isOpen = false;
  @tracked selectedOptionIndex = -1;

  // Internal
  _dropdownApi;

  get minTime() {
    return this.args.minTime || '00:00';
  }

  get maxTime() {
    return this.args.maxTime || '23:59';
  }

  get placeholder() {
    return this.args.placeholder || 'Enter time...';
  }

  get step() {
    return this.args.step || 30;
  }

  get amPm() {
    return typeof this.args.amPm === 'boolean'
      ? this.args.amPm
      : shouldUseAmPm();
  }

  get options() {
    let { amPm, minTime, maxTime, step, selectStep } = this;

    return {
      amPm: Boolean(amPm),
      step,
      selectStep,
      minTime: parseTime(minTime),
      maxTime: parseTime(maxTime),
    };
  }

  get format() {
    let { amPm } = this.options;
    return amPm ? 'hh:mm a' : 'HH:mm';
  }

  get timeOptions() {
    let { minTime, maxTime, selectStep } = this.options;
    let { format } = this;

    let steps = buildTimeRange({
      minTime,
      maxTime,
      step: selectStep,
    });

    return steps.map((time) => {
      return {
        value: time.format(format),
        time,
      };
    });
  }

  get filteredOptions() {
    let val = (this.inputValue || '').toLowerCase();
    let options = this.timeOptions;

    return options.filter((option) => {
      let optionValue = option.value;
      return optionValue.toLowerCase().indexOf(val) > -1;
    });
  }

  get displayValue() {
    let { value } = this.args;
    let { format } = this;

    value = parseTime(value);
    value = moment.isMoment(value) ? value.format(format) : value;
    return value || null;
  }

  constructor() {
    super(...arguments);

    assert(
      '<TimePicker>: You have to specify @onChange',
      typeof this.args.onChange === 'function'
    );
  }

  @action
  selectValue(value) {
    this._updateValueForString(value);
  }

  @action
  selectCurrent() {
    this._selectCurrent();
  }

  @action
  selectUp() {
    this.selectedOptionIndex = Math.max(this.selectedOptionIndex - 1, -1);
  }

  @action
  selectDown() {
    let optionsLength = this.filteredOptions.length;
    this.selectedOptionIndex = Math.min(
      this.selectedOptionIndex + 1,
      optionsLength - 1
    );
  }

  @action
  updateInputValue(value) {
    this.inputValue = value;
    this.selectedOptionIndex = -1;
  }

  @action
  onDropdownOpened(dropdownApi) {
    this.isOpen = true;
    this._dropdownApi = dropdownApi;
  }

  @action
  onDropdownClosed() {
    this.isOpen = false;
    this.inputValue = null;
    this.selectedOptionIndex = -1;
  }

  @action
  onKeyDown(dropdownApi, event) {
    // If the input is focused, and the user starts typing a number or letter, we want to auto-open the dropdown
    let { key } = event;
    let regex = /^[\d\w]$/;
    if (regex.test(key)) {
      dropdownApi.actions.open();

      // Add to the input, in order to not lose the typed characters
      let inputValue = this.inputValue || '';
      this.inputValue = `${inputValue}${key}`;
    }
  }

  @action
  closeDropdown() {
    this._close();
  }

  @action
  onInsertInput(timeInput) {
    if (timeInput !== document.activeElement) {
      timeInput.focus();
    }
  }

  _close() {
    this._dropdownApi?.actions.close();
  }

  _selectCurrent() {
    let options = this.filteredOptions;
    let selected = this.selectedOptionIndex;

    // If nothing is selected, simply try to parse the entered string
    if (selected === -1) {
      let { inputValue } = this;
      this._updateValueForString(inputValue);
      return;
    }

    let selectedOption = options[selected];

    // If, for whatever reason, the selected options doesn't exist
    // abort - but this shouldn't actually happen
    if (!selectedOption) {
      return;
    }

    // Actually get the string value from the option
    let { value } = selectedOption;
    this._updateValueForString(value);
  }

  _updateValueForString(stringValue) {
    let parsedValue = (stringValue || '').toLowerCase();
    let newValue = parseTime(parsedValue);
    this._sendNewValueAction(newValue);

    // Now close the input
    this._close();
  }

  _sendNewValueAction(newValue) {
    if (this.args.disabled) {
      return;
    }

    if (this.args.value !== newValue) {
      this.args.onChange(newValue);
    }
  }
}
