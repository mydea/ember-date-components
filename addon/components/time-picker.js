import Component from '@ember/component';
import { next } from '@ember/runloop';
import { computed, set, get } from '@ember/object';
import layout from '../templates/components/time-picker';
import moment from 'moment';
import parseTime from 'ember-date-components/utils/parse-time';
import buildTimeRange from 'ember-date-components/utils/build-time-range';
import { shouldUseAmPm } from 'ember-date-components/utils/should-use-am-pm';

/**
 * An input field to choose a time in a day.
 * The user can either enter a time directly, or choose from a list.
 *
 * @namespace EmberDateComponents.Component
 * @class TimePicker
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  layout,

  classNames: ['time-picker__wrapper'],
  classNameBindings: ['isOpen:time-picker__wrapper--open'],

  /**
   * The current value of the time picker.
   * Has to be a moment.js object or null.
   *
   * @attribute value
   * @type {Date}
   * @public
   */
  value: null,

  /**
   * If this is true, the time picker is disabled and the selected time cannot be changed.
   *
   * @attribute disabled
   * @type {Boolean}
   * @default false
   * @public
   */
  disabled: false,

  /**
   * The action to call when the time changes.
   *
   * @event action
   * @param {Date} time The new time
   * @public
   */
  action: null,

  /**
   * If the display format should use am/pm or the 24:00 format.
   * By default, this will be determined by checking the localized date formatting of moment.js.
   * However, if you don't use moment.js-locales, this will always return true (because the default locale, 'en', uses am/pm).
   * In such a case, you can just overwrite this.
   *
   * @attribute amPm
   * @type {Boolean}
   * @public
   */
  amPm: computed(function() {
    return shouldUseAmPm();
  }),

  /**
   * The minimum time which can be selected.
   * This should be either a parseable string or a moment.js object.
   *
   * @attribute minTime
   * @type {String|Object}
   * @default '00:00'
   * @public
   */
  minTime: '00:00',

  /**
   * The maximum time which can be selected.
   * This should be either a parseable string or a moment.js object.
   *
   * @attribute minTime
   * @type {String|Object}
   * @default '23:59'
   * @public
   */
  maxTime: '23:59',

  /**
   * The placeholder for the time input.
   *
   * @attribute placeholder
   * @type {String}
   * @public
   */
  placeholder: 'Enter time...',

  /**
   * The step in minutes which can be selected.
   * Entered times will be rounded to this accuracy.
   * If you don't specify a selectStep separately, this value will also be used as selectStep.
   *
   * @attribute step
   * @type {Number}
   * @default 30
   * @public
   */
  step: 30,

  /**
   * The step from which dates can be selected in the dropdown.
   * If this is not explicitly set, step will be used for this value as well.
   * However, if values like 22:14 should be allowed but not shown in the dropdown,
   * this can be set to a different value.
   *
   * @attribute selectStep
   * @type {Number}
   * @default 30
   * @public
   */
  selectStep: null,

  /**
   * Classes which should be added to the input.
   *
   * @attribute inputClasses
   * @type {String}
   * @public
   */
  inputClasses: '',

  /**
   * Value passed to `ember-basic-dropdown`
   *
   * @attribute value
   * @type {Boolean}
   * @public
   */
  renderInPlace: false,

  /**
   * Value passed to `ember-basic-dropdown`
   *
   * Available values are right|center|left
   *
   * @attribute value
   * @type {String}
   * @public
   */
  horizontalPosition: 'auto',

  /**
   * Value passed to `ember-basic-dropdown`
   *
   * Available values are above|below
   *
   * @attribute value
   * @type {String}
   * @public
   */
  verticalPosition: 'auto',

  /**
   * Value passed to `ember-basic-dropdown`
   *
   * @attribute matchTriggerWidth
   * @type {Boolean}
   * @default true
   * @public
   */
  matchTriggerWidth: true,

  /**
   * Classes which should be added to the dropdown container.
   *
   * @attribute dropdownClasses
   * @type {String}
   * @public
   */
  dropdownClasses: '',

  /**
   * Optional classes for the button.
   *
   * @attribute buttonClasses
   * @type {String}
   * @optional
   * @public
   */
  buttonClasses: '',

  /**
   * If the dropdown is open.
   *
   * @property isOpen
   * @type {Boolean}
   * @protected
   */
  isOpen: false,

  /**
   * Which option is currently selected.
   * If -1, no option is selected.
   *
   * @property selectedOptionIndex
   * @type {Number}
   * @protected
   */
  selectedOptionIndex: -1,

  /**
   * The general options for this component.
   * These are built from the single attributes, but you could theoretically overwrite this if you need custom behaviour.
   * The options should always be fetched via this object.
   *
   * @property options
   * @type {amPm, step, minTime, maxTime}
   * @protected
   */
  options: computed(function() {
    let amPm = get(this, 'amPm');
    let minTime = get(this, 'minTime');
    let maxTime = get(this, 'maxTime');
    let step = get(this, 'step');
    let selectStep = get(this, 'selectStep');

    return {
      amPm,
      step,
      selectStep,
      minTime: parseTime(minTime),
      maxTime: parseTime(maxTime)
    };
  }),

  /**
   * The format which should be used.
   * By default, this is computed via the amPm setting.
   * You can overwrite this if necessary.
   *
   * @property format
   * @type {String}
   * @protected
   */
  format: computed('options.amPm', function() {
    let { amPm } = get(this, 'options');
    return amPm ? 'hh:mm a' : 'HH:mm';
  }),

  /**
   * The options to chose from in the dropdown.
   *
   * @property timeOptions
   * @type {Object[]}
   * @readOnly
   * @protected
   */
  timeOptions: computed('options.{minTime,maxTime,selectStep}', function() {
    let { minTime, maxTime, selectStep } = get(this, 'options');
    let format = get(this, 'format');

    let steps = buildTimeRange({
      minTime,
      maxTime,
      step: selectStep
    });

    return steps.map((time) => {
      return {
        value: time.format(format),
        time
      };
    });
  }),

  /**
   * The options for the dropdown which are currently visible.
   * This filters the timeOptions by the inputValue.
   *
   * @property filteredOptions
   * @type {Object[]}
   * @readOnly
   * @protected
   */
  filteredOptions: computed('timeOptions.[]', 'inputValue', function() {
    let val = (get(this, 'inputValue') || '').toLowerCase();
    let options = get(this, 'timeOptions');

    return options.filter((option) => {
      let optionValue = get(option, 'value');
      return optionValue.toLowerCase().indexOf(val) > -1;
    });
  }),
  /**
   * The value that is currently entered in the input field.
   *
   * @property inputValue
   * @type {String}
   * @protected
   */
  inputValue: null,

  /**
   * The API of ember-basic-dropdown.
   * This is used to manually open/close the dropdown.
   *
   * @property _dropdownApi
   * @type {Object}
   * @private
   */
  _dropdownApi: null,

  /**
   * The value actual value to display in the button.
   *
   * @property displayValue
   * @type {String}
   * @readOnly
   * @protected
   */
  displayValue: computed('value', function() {
    let value = get(this, 'value');
    let format = get(this, 'format');

    value = parseTime(value);
    value = moment.isMoment(value) ? value.format(format) : value;
    return value || null;
  }),

  actions: {

    selectValue(value) {
      this._updateValueForString(value);
    },

    selectCurrent() {
      this._selectCurrent();
    },

    selectUp() {
      this.decrementProperty('selectedOptionIndex');
      if (get(this, 'selectedOptionIndex') < -1) {
        set(this, 'selectedOptionIndex', -1);
      }
    },

    selectDown() {
      this.incrementProperty('selectedOptionIndex');
      let optionsLength = get(this, 'filteredOptions.length');

      if (get(this, 'selectedOptionIndex') > optionsLength) {
        set(this, 'selectedOptionIndex', optionsLength - 1);
      }
    },

    updateInputValue(value) {
      set(this, 'inputValue', value);
      set(this, 'selectedOptionIndex', -1);
    },

    onDropdownOpened(dropdownApi) {
      set(this, 'isOpen', true);
      set(this, '_dropdownApi', dropdownApi);

      this._focusTimeInput();
    },

    onDropdownClosed() {
      set(this, 'isOpen', false);
      set(this, 'inputValue', null);
      set(this, 'selectedOptionIndex', -1);
    },

    onTriggerKeyDown(dropdownApi, event) {
      // If the input is focused, and the user starts typing a number or letter, we want to auto-open the dropdown
      let { key } = event;
      let regex = /^[\d\w]$/;
      if (regex.test(key)) {
        dropdownApi.actions.open();

        // Add to the input, in order to not lose the typed characters
        let inputValue = get(this, 'inputValue') || '';
        set(this, 'inputValue', `${inputValue}${key}`);
      }
    },

    closeDropdown() {
      this._close();
    }

  },

  _close() {
    let dropdownApi = get(this, '_dropdownApi');
    if (dropdownApi) {
      dropdownApi.actions.close();
    }
  },

  _selectCurrent() {
    let options = get(this, 'filteredOptions');
    let selected = get(this, 'selectedOptionIndex');

    // If nothing is selected, simply try to parse the entered string
    if (selected === -1) {
      let inputValue = get(this, 'inputValue');
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
    let value = get(selectedOption, 'value');
    this._updateValueForString(value);
  },

  _updateValueForString(stringValue) {
    let parsedValue = (stringValue || '').toLowerCase();
    let newValue = parseTime(parsedValue);
    this._sendNewValueAction(newValue);

    // Now close the input
    this._close();
  },

  _sendNewValueAction(newValue) {
    let value = get(this, 'value');
    let action = get(this, 'action');
    let isDisabled = get(this, 'disabled');

    if (action && !isDisabled && value !== newValue) {
      return action(newValue);
    }
  },

  /**
   * Move the focus to the date picker.
   * This is called when `_open` is called, to ensure that the date picker can be used with the keyboard.
   * This will also save the previously focused element, to ensure we can correctly return the focus later.
   *
   * @method _focusDatePicker
   * @private
   */
  _originallyFocusedElement: null,
  _focusTimeInput() {
    if (get(this, 'isDestroyed')) {
      return;
    }
    let originallyFocusedElement = document.activeElement;
    set(this, '_originallyFocusedElement', originallyFocusedElement);

    let elementId = get(this, 'elementId');

    next(() => {
      let timeInput = document.querySelector(`[data-time-picker-input-instance="${elementId}"]`);
      if (timeInput && timeInput !== document.activeElement) {
        timeInput.focus();
      }
    });
  },

  /**
   * Reset the focus to the previously focused element.
   * This is called when the date picker is closed.
   *
   * @method _resetFocus
   * @private
   */
  _resetFocus() {
    let originallyFocusedElement = get(this, '_originallyFocusedElement');
    set(this, '_originallyFocusedElement', null);

    if (originallyFocusedElement && document.contains(originallyFocusedElement)) {
      next(() => originallyFocusedElement.focus());
    }
  }

});
