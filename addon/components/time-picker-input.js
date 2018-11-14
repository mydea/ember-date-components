import { get } from '@ember/object';
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

  attributeBindings: [
    'disabled',
    'data-time-picker-input-instance',
    'tabindex'
  ],

  type: 'text',

  tabindex: -1,

  /**
   * If this is true, the time picker is disabled and the selected time cannot be changed.
   *
   * @attribute disabled
   * @type {Boolean}
   * @default false
   * @public
   */
  disabled: false,

  keyUp() {
    // overwrite default implementation
  },

  keyDown(event) {
    // Tab doesn't trigger keyUp, so we need to capture it in keyDown
    switch (event.key) {
      case 'Enter':
        return this._enter(event);
      case 'Escape':
        return this._escape(event);
      case 'ArrowUp':
        return this._arrowUp(event);
      case 'ArrowDown':
        return this._arrowDown(event);
      case 'Tab':
        return this._tab(event);
    }
  },

  input() {
    once(this, this.inputChange);
  },

  inputChange() {
    this._elementValueDidChange();
    let value = get(this, 'value');
    let action = get(this, 'input-change');
    return action(value, this);
  },

  _tab(event) {
    let action = get(this, 'tab');
    return action(this, event);
  },

  _arrowUp(event) {
    let action = get(this, 'arrow-up');
    return action(this, event);
  },

  _arrowDown(event) {
    let action = get(this, 'arrow-down');
    return action(this, event);
  },

  _escape(event) {
    let action = get(this, 'escape');
    return action(this, event);
  },

  _enter(event) {
    let action = get(this, 'enter');
    return action(this, event);
  }
});
