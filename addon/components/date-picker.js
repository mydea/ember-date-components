import Ember from 'ember';
import layout from '../templates/components/date-picker';
import moment from 'moment';

const {
  get,
  set,
  computed
} = Ember;

export default Ember.Component.extend({
  layout,

  classNames: ['date-picker'],

  // ATTRIBUTES BEGIN ----------------------------------------

  value: null,

  minDate: null,

  maxDate: null,

  range: false,

  /**
   * The action to call whenever one of the value changes.
   *
   * @event action
   * @param {Date} dateFrom The selected from date (or null if empty)
   * @param {Date} dateTo The selected to date (or null if empty)
   * @public
   */
  action: null,

  // ATTRIBUTES END ----------------------------------------

  // PROPERTIES BEGIN ----------------------------------------

  _dates: [],

  currentMonth: null,

  isToStep: false,

  selectedDates: computed('_dates.[]', function() {
    let arr = [];
    let [dateFrom, dateTo] = get(this, '_dates');
    if (dateFrom) {
      arr.push(dateFrom);
    }
    if (dateTo) {
      arr.push(dateTo);
    }
    return Ember.A(arr);
  }),

  // METHODS BEGIN ----------------------------------------

  init() {
    let val = get(this, 'value');
    let isRange = get(this, 'range');

    if (val) {
      if (Ember.typeOf(val) !== 'array') {
        val = Ember.A([val]);
      }
    } else {
      val = Ember.A();
    }

    set(this, '_dates', val);

    if (val.length > 0) {
      let month = val[0].clone().startOf('month');
      set(this, 'currentMonth', month);
    } else {
      let month = moment().startOf('month');
      set(this, 'currentMonth', month);
    }

    if (val.length === 1 && isRange) {
      set(this, 'isToStep', true);
    }

    this._super(...arguments);
  },

  /**
   * Actually send the action.
   *
   * @method _sendAction
   * @private
   */
  _sendAction() {
    let action = get(this, 'attrs.action');
    let vals = get(this, '_dates');
    let isRange = get(this, 'range');

    if (action) {
      action(isRange ? vals : vals[0] || null);
    }
  },

  _setSingleDate(date) {
    let vals = Ember.A([date]);
    set(this, '_dates', vals);
    return vals;
  },

  _setDateRange(date) {
    let [dateFrom] = get(this, '_dates');
    let isToStep = get(this, 'isToStep');
    let vals;

    if (!isToStep) {
      vals = Ember.A([date, null]);
    } else {
      if (date.valueOf() < dateFrom.valueOf()) {
        vals = Ember.A([date, dateFrom]);
      } else {
        vals = Ember.A([dateFrom, date]);
      }
    }

    this.toggleProperty('isToStep');
    set(this, '_dates', vals);
    return vals;
  },

  // METHODS END ----------------------------------------

  // ACTIONS BEGIN ----------------------------------------

  actions: {

    gotoNextMonth() {
      let month = get(this, 'currentMonth');
      set(this, 'currentMonth', month.clone().add(1, 'month'));
    },

    gotoPreviousMonth() {
      let month = get(this, 'currentMonth');
      set(this, 'currentMonth', month.clone().subtract(1, 'month'));
    },

    updateDate(date) {
      let isRange = get(this, 'range');

      if (!isRange) {
        this._setSingleDate(date);
      } else {
        this._setDateRange(date);
      }

      this._sendAction();
    }
  }

  // ACTIONS END ----------------------------------------
});
