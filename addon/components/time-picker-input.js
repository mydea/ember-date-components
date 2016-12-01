import Ember from 'ember';

const {
  get,
  TextField
} = Ember;

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
      return this.inputChange();
    }
  },

  inputChange() {
    this._elementValueDidChange();
    let value = get(this, 'value');
    this.sendAction('input-change', value, this);
  },

  arrowUp(event) {
    this.sendAction('arrow-up', this, event);
  },

  arrowDown(event) {
    this.sendAction('arrow-down', this, event);
  },

  escape(event) {
    this.sendAction('escape', this, event);
  },

  enter(event) {
    this.sendAction('enter', this, event);
  },

  KEY_EVENTS: {
    38: 'arrowUp',
    40: 'arrowDown',
    13: 'enter',
    27: 'escape'
  }
});
