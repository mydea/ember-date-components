import Ember from 'ember';
import layout from '../templates/components/date-range-picker';

const {
  get,
  set,
  getProperties
} = Ember;

export default Ember.Component.extend({
  layout,

  dateFrom: null,
  dateTo: null,

  isToStep: false,

  placeholderFrom: 'Select From...',
  placeholderTo: 'Select To...',

  _sendAction() {
    let action = get(this, 'attrs.action');
    let {
      dateFrom,
      dateTo
    } = getProperties(this, 'dateFrom', 'dateTo');

    if (action) {
      action(dateFrom || null, dateTo || null);
    }
  },

  _openPicker() {
    set(this, 'isOpen', true);
  },

  _closePicker() {
    set(this, 'isOpen', false);
    set(this, 'isToStep', false);
  },

  actions: {
    updateDateFrom(date) {
      set(this, 'dateFrom', date);
      set(this, 'isToStep', true);
    },

    updateDateTo(date) {
      set(this, 'dateTo', date);
      set(this, 'isToStep', false);
      this._sendAction();
      this._closePicker();
    }
  }
});
