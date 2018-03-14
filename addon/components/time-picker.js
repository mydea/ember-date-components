import Component from '@ember/component';
import { run } from '@ember/runloop';
import { isNone } from '@ember/utils';
import { computed, set, get } from '@ember/object';
import layout from '../templates/components/time-picker';
import moment from 'moment';
import parseTime from 'ember-date-components/utils/parse-time';
import buildTimeRange from 'ember-date-components/utils/build-time-range';

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
    return moment().startOf('day').format('LLL').toLowerCase().indexOf('am') > -1;
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
   * Classes which should be added to the dropdown container.
   *
   * @attribute dropdownClasses
   * @type {String}
   * @public
   */
  dropdownClasses: '',

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
   * @property selected
   * @type {Number}
   * @protected
   */
  selected: -1,

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
   * The internal value.
   * This is used to avoid two-way databinding.
   *
   * @property _value
   * @type {Object|null}
   * @private
   */
  _value: null,

  /**
   * The internal string representation of the value, e.g. the formatted value.
   *
   * @property stringValue
   * @type {String}
   * @protected
   */
  stringValue: null,

  /**
   * The value that is currently entered in the input field.
   *
   * @property inputValue
   * @type {String}
   * @protected
   */
  inputValue: null,

  /**
   * The value which is currently displayed.
   * This is either inputValue, if it is not null, or else stringValue.
   *
   * @property displayValue
   * @type {String}
   * @protected
   */
  displayValue: computed('inputValue', 'stringValue', function() {
    let inputValue = get(this, 'inputValue');
    let value = get(this, 'stringValue');
    return isNone(inputValue) ? value : inputValue;
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
   * The API of ember-basic-dropdown.
   * This is used to manually open/close the dropdown.
   *
   * @property _dropdownApi
   * @type {Object}
   * @private
   */
  _dropdownApi: null,

  /**
   * Open the dropdown.
   *
   * @method _open
   * @private
   */
  _open() {
    if (get(this, 'disabled')) {
      return;
    }
    set(this, 'isOpen', true);
  },

  /**
   * Close the dropdown.
   *
   * @method _close
   * @private
   */
  _close(forceCloseDropdown = true) {
    set(this, 'isOpen', false);
    this._reset();

    if (forceCloseDropdown) {
      this._closeDropdown();
    }
  },

  _closeDropdown() {
    let dropdownApi = get(this, '_dropdownApi');
    if (dropdownApi) {
      dropdownApi.actions.close();
    }
  },

  /**
   * Reset the temporary values.
   *
   * @method _reset
   * @private
   */
  _reset() {
    set(this, 'selected', -1);
    set(this, 'inputValue', null);

    // Set value correctly
    this._initValue();
  },

  /**
   * Check new value..
   * If they have changed, send the action & set them on the component.
   *
   * @method _checkNewValue
   * @param {Object} newValue A new moment.js object
   * @private
   */
  _checkNewValue(newValue) {
    if (newValue !== get(this, '_value')) {
      set(this, '_value', newValue);
      this._sendAction();
    }
  },

  /**
   * Check stringValue and generate the new value from it.
   *
   * @method _checkInput
   * @private
   */
  _checkInput() {
    let value = (get(this, 'stringValue') || '').toLowerCase();
    let newValue = parseTime(value);
    this._checkNewValue(newValue);
  },

  /**
   * Check the inputValue as string and generate the new value from it.
   *
   * @method _checkStringInput
   * @private
   */
  _checkStringInput() {
    let inputValue = get(this, 'inputValue');
    let newValue = parseTime(inputValue);

    if (!newValue) {
      set(this, 'stringValue', null);
      this._checkNewValue();
      return;
    }

    let format = get(this, 'format');
    let time = this._normalizeTime(newValue);

    let value = time.format(format);

    set(this, 'stringValue', value);
    this._checkInput();
  },

  /**
   * Takes a moment.js object and normalizes it to the nearest step.
   *
   * @method _normalizeTime
   * @param time
   * @param step
   * @returns {*}
   * @private
   */
  _normalizeTime(time) {
    let { minTime, maxTime, step } = get(this, 'options');

    let min = minTime ? minTime.valueOf() : null;
    let max = maxTime ? maxTime.valueOf() : null;
    step = !isNone(step) ? step : 30;
    let val = time ? time.valueOf() : null;

    // if time is before minTime, return minTime
    if (!isNone(min) && val < min) {
      return moment(min);
    }

    // if time is after maxTime, return maxTime
    if (!isNone(max) && val > max) {
      return moment(max);
    }

    // if time is not in step range, round it up/down
    let stepMs = step * 60 * 1000;
    let diff = val % stepMs;
    if (diff !== 0) {
      // If diff > 50%, round up, elese round down
      if (diff * 2 > stepMs) {
        return moment(val + stepMs - diff);
      } else {
        return moment(val - diff);
      }
    }

    return time;
  },

  /**
   * Send the action.
   * The action receives a moment.js object or null as parameter.
   *
   * @method _sendAction
   * @private
   */
  _sendAction() {
    let value = get(this, '_value') || null;
    let action = get(this, 'action');

    if (action && !get(this, 'disabled')) {
      action(value);
    }

    this._close();
  },

  /**
   * Initialise stringValue from value.
   * This is called on reset and when the value changes from outside.
   *
   * @method _initValue
   * @private
   */
  _initValue() {
    let value = get(this, '_value');
    let format = get(this, 'format');

    value = parseTime(value);
    value = moment.isMoment(value) ? value.format(format) : value;
    set(this, 'stringValue', value || null);
  },

  _closeNext() {
    if (get(this, 'isDestroyed') || !get(this, 'isOpen')) {
      return;
    }
    let inputValue = get(this, 'inputValue');
    // If there is an input, this means it hasn't been processed yet
    // --> Process it now!
    if (inputValue) {
      this._checkStringInput();
    }

    this._close();
  },

  /**
   * Prepare data for the time input.
   *
   * @method didReceiveAttrs
   * @protected
   * @override
   */
  didReceiveAttrs() {
    // Set selectStep to step
    let step = get(this, 'step');
    if (!get(this, 'selectStep')) {
      set(this, 'selectStep', step);
    }

    // Set the internal value
    set(this, '_value', get(this, 'value'));
    this._initValue();
  },

  actions: {

    open() {
      let timer = get(this, '_closeNextTimer');
      if (timer) {
        run.cancel(timer);
      }

      this._open();
    },

    openAndClear() {
      set(this, 'isOpen', true);
      set(this, 'stringValue', null);
    },

    close() {
      this._close();
    },

    closeNext() {
      // Wait for all other events to finish
      let closeNext = run.debounce(this, this._closeNext, 100);
      set(this, '_closeNextTimer', closeNext);
    },

    selectUp() {
      this.decrementProperty('selected');
      if (get(this, 'selected') < -1) {
        set(this, 'selected', -1);
      }
    },

    selectDown() {
      this.incrementProperty('selected');
      let optionsLength = get(this, 'filteredOptions.length');

      if (get(this, 'selected') > optionsLength) {
        set(this, 'selected', optionsLength - 1);
      }
    },

    selectCurrent() {
      let options = get(this, 'filteredOptions');
      let selected = get(this, 'selected');

      // If nothing is selected, simply try to parse the entered string
      if (selected === -1) {
        this._checkStringInput();
        return;
      }

      let selectedOption = options[selected];

      // If, for whatever reason, the selected options doesn't exist
      // Just parse the string - this should't happen, normally
      if (!selectedOption) {
        this._checkStringInput();
        return;
      }

      // Actually set stringValue and check the input
      let value = get(selectedOption, 'value');
      set(this, 'stringValue', value);
      this._checkInput();
      this._close();
    },

    selectValue(value) {
      set(this, 'stringValue', value);
      this._checkInput();
      this._close();
    },

    updateInputValue(val) {
      // Always open the select box when someone starts to type
      this._open();
      set(this, 'inputValue', val);
    },

    openDropdown(dropdownApi) {
      set(this, '_dropdownApi', dropdownApi);
    },

    closeDropdown() {
      this._close(false);
    },

    onKeyDown(dropdownApi, event) {
      // Also handle the enter event here, since ember-basic-dropdown seems to be interfering somewhere
      let { keyCode } = event;
      let enterKeyCode = 13;
      let tabKeyCode = 9;
      let spaceKeyCode = 32;
      if (keyCode === enterKeyCode || keyCode === tabKeyCode) {
        this.send('selectCurrent');
        return false;
      }
      if (keyCode === spaceKeyCode) {
        return false;
      }
    }
  }
});
