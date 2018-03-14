import { get, computed } from '@ember/object';
import TextField from '@ember/component/text-field';
import { once } from '@ember/runloop';

/**
 * This is an extended {{input}} to send appropriate events for arrowUp/arrowDown.
 * It is also slightly changed to send an input-changed event when a key that is neither arrowUp/arrowDown, enter or escape
 * is pressed.
 *
 * @namespace EmberDateComponents
 * @class TimePickerInput
 * @extends Ember.TextField
 * @public
 */
export default TextField.extend({
  classNames: [],

  attributeBindings: ['disabled'],

  type: 'text',

  /**
   * If this is true, the time picker is disabled and the selected time cannot be changed.
   *
   * @attribute disabled
   * @type {Boolean}
   * @default false
   * @public
   */
  disabled: false,

  KEY_EVENTS: computed(function() {
    return {
      38: 'arrowUp',
      40: 'arrowDown',
      13: 'enter',
      27: 'escape'
    };
  }),

  interpretKeyEvents(event) {
    if (!event) {
      return this.inputChange();
    }
    let map = get(this, 'KEY_EVENTS');
    let { keyCode } = event;

    let method = map[keyCode];
    if (method) {
      return this[method](event);
    } else {
      return once(this, this.inputChange);
    }
  },

  change() {
    once(this, this.inputChange);
  },

  inputChange() {
    this._elementValueDidChange();
    let value = get(this, 'value');

    let action = get(this, 'input-change');
    if (action && typeof action === 'function') {
      return action(value, this);
    } else {
      console.warn('input-change action on time-picker-input needs to be a closure action.'); // eslint-disable-line
    }
  },

  arrowUp(event) {
    let action = get(this, 'arrow-up');

    if (action && typeof action === 'function') {
      return action(this, event);
    } else {
      console.warn('arrow-up action on time-picker-input needs to be a closure action.'); // eslint-disable-line
    }
  },

  arrowDown(event) {
    let action = get(this, 'arrow-down');

    if (action && typeof action === 'function') {
      return action(this, event);
    } else {
      console.warn('arrow-down action on time-picker-input needs to be a closure action.'); // eslint-disable-line
    }
  },

  escape(event) {
    let action = get(this, 'escape');

    if (action && typeof action === 'function') {
      return action(this, event);
    } else {
      console.warn('escape action on time-picker-input needs to be a closure action.'); // eslint-disable-line
    }
  },

  enter(event) {
    let action = get(this, 'enter');

    if (action && typeof action === 'function') {
      return action(this, event);
    } else {
      console.warn('enter action on time-picker-input needs to be a closure action.'); // eslint-disable-line
    }
  }
});
