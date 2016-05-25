import Ember from 'ember';
import layout from '../templates/components/date-picker';
import moment from 'moment';

const {
  get,
  set,
  computed
} = Ember;

/**
 * A versatile date picker component.
 * This is 100% ember based and uses no other date picker library.
 *
 * @namespace EmberDateComponents
 * @class DatePicker
 * @extends Ember.Component
 * @public
 */
export default Ember.Component.extend({
  layout,

  classNames: ['date-picker__wrapper'],
  classNameBindings: ['isOpen:date-picker__wrapper--open'],

  // ATTRIBUTES BEGIN ----------------------------------------

  /**
   * The default value for the date picker.
   * Can be a value or an array.
   * Note that internally, this will always be converted to an array (if for a sinle-date picker field).
   * So it makes no difference if it is val or [val].
   *
   * @attribute value
   * @type {Date}
   * @optional
   * @public
   */
  value: null,

  /**
   * An optional minimum date for this date picker.
   * No dates before this date will be selectable.
   *
   * @attribute minDate
   * @type {Date}
   * @optional
   * @public
   */
  minDate: null,

  /**
   * An optional maximum date for this date picker.
   * No dates after this date will be selectable.
   *
   * @attribute masDate
   * @type {Date}
   * @optional
   * @public
   */
  maxDate: null,

  /**
   * If this date picker should select a range instead of a single date.
   * If this is set, the action's parameter will always be an array with two elements, both of which could be null.
   * The dates will always be in order (e.g. earlier date as first element, later date as second element).
   *
   * @attribute range
   * @type {Boolean}
   * @default false
   * @public
   */
  range: false,

  /**
   * The placeholder for the button, if no date is selected.
   * By default, this will be either 'Select Date...' or 'Select Date Range...'.
   *
   * @attribute placeholder
   * @type {String}
   * @optional
   * @public
   */
  placeholder: computed('range', function() {
    return get(this, 'range') ? 'Select Date Range...' : 'Select Date...';
  }),

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
   * The date format which should be used for the button.
   * Defaults to localized 'L'.
   *
   * @attribute buttonDateFormat
   * @type {String}
   * @default 'L'
   * @public
   */
  buttonDateFormat: 'L',

  /**
   * The action to call whenever one of the value changes.
   *
   * @event action
   * @param {Date|Date[]} date Either a single date (or null) if `range=false`, or an array with two elements if `range=true`.
   * @public
   */
  action: null,

  // ATTRIBUTES END ----------------------------------------

  // PROPERTIES BEGIN ----------------------------------------

  /**
   * The internal dates. No matter if it is a range or a single date selector,
   * the dates will always be saved in this array.
   *
   * @property _dates
   * @type {Date[]}
   * @private
   */
  _dates: [],

  /**
   * The currently visible month.
   * This is set on initialisation. It is either the first selected date (if a value is provided), or today.
   *
   * @property currentMonth
   * @type {Date}
   * @private
   */
  currentMonth: null,

  /**
   * If the current selection is the to-step.
   * This is automatically set internally for a range picker.
   *
   * @property isToStep
   * @type {Boolean}
   * @private
   */
  isToStep: false,

  /**
   * If the date picker is open.
   *
   * @property isOpen
   * @type {Boolean}
   * @private
   */
  isOpen: false,

  /**
   * The text for the button.
   * This will either return the placeholder, or the formatted date(s).
   *
   * @property buttonText
   * @type {String}
   * @private
   */
  buttonText: computed('range', '_dates.[]', function() {
    let isRange = get(this, 'range');
    let vals = get(this, '_dates') || Ember.A([]);
    let dateFormat = get(this, 'buttonDateFormat');

    let [dateFrom, dateTo] = vals;

    if (!isRange) {
      if (!dateFrom) {
        return get(this, 'placeholder');
      }
      return dateFrom.format(dateFormat);
    }

    if (!dateFrom && !dateTo) {
      return get(this, 'placeholder');
    }

    return `${dateFrom.format(dateFormat)} - ${dateTo ? dateTo.format(dateFormat) : '...'}`;
  }),

  /**
   * An array with all selected dates.
   * This contains only selected dates, no null values! This means it can have zero, one or two values.
   * This is passed to date-picker-month to show the selected dates.
   *
   * @property selectedDates
   * @type {Date[]}
   * @readOnly
   * @private
   */
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

  /**
   * The width of the calendar widget. If you use the default styling, this will be 300.
   * If you do not use the default styling, change this to the value you use.
   * This is used to calculate the correct position of the calendar if it would run out of the window on the right side.
   *
   * @attribute calendarWidth
   * @type {Number}
   * @default 280
   * @private
   */
  calendarWidth: 280,

  /**
   * This string is built to fix the offset of the component.
   * For example, if the date-picker is at the right edge of the window, the date-picker would run outside of the window.
   * This offset ensures that the date picker will stay inside of the window.
   * This will be set to a style-compatible SafeString, e.g. `transform: translate(100px,0)`.
   *
   * @property translateX
   * @type {String}
   * @private
   */
  translateX: null,

  // PROPERTIES END ----------------------------------------

  // HOOKS BEGIN ----------------------------------------

  didReceiveAttrs() {
    this._super(...arguments);
    this._setupValue();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._destroyOutsideListener();
  },

  // HOOKS END ----------------------------------------

  // METHODS BEGIN ----------------------------------------

  /**
   * Setup the value.
   * This is called on didReceiveAttrs and transforms the given value into an array which can be used by this component.
   *
   * @method _setupValue
   * @private
   */
  _setupValue() {
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
      val.pushObject(null);
    } else if (val.length === 0 && isRange) {
      val.pushObjects([null, null]);
    }
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

  /**
   * Open the date picker.
   *
   * @method _open
   * @private
   */
  _open() {
    set(this, 'isOpen', true);
    this._setupOutsideListener();

    let $el = this.$();

    let windowWidth = Ember.$(window).width();
    let elLeftOffset = $el.offset().left;
    let elOffset = elLeftOffset + get(this, 'calendarWidth');

    if (elOffset > windowWidth) {
      let translate = elOffset - windowWidth + 10;
      let style = new Ember.Handlebars.SafeString(`transform: translate(-${translate}px, 0)`);
      set(this, 'translateX', style);
    } else {
      set(this, 'translateX', null);
    }
  },

  /**
   * Close the date picker.
   *
   * @method _close
   * @private
   */
  _close() {
    set(this, 'isOpen', false);
    this._destroyOutsideListener();
  },

  /**
   * Set a single date value.
   * It will also close the date picker.
   *
   * @method _setSingleDate
   * @param {Date[]} date The selected date in an array
   * @returns {Date[]}
   * @private
   */
  _setSingleDate(date) {
    let vals = Ember.A([date]);
    set(this, '_dates', vals);
    this._close();
    return vals;
  },

  /**
   * Set date range values.
   * It will also close the date picker if it is the to-date.
   *
   * @method _setDateRange
   * @param {Date[]} date The selected dates in an array
   * @returns {Date[]}
   * @private
   */
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
      this._close();
    }

    this.toggleProperty('isToStep');
    set(this, '_dates', vals);
    return vals;
  },

  /**
   * Setup an event listener on the body to auto-close the date-picker if the user clicks outside.
   *
   * @method _setupOutsideListener
   * @private
   */
  _setupOutsideListener() {
    let $element = this.$();

    Ember.$('body').on(`click.${this.elementId}`, (e) => {
      let $target = Ember.$(e.target);
      if (!$target.closest($element).length) {
        this._close();
      }
    });
  },

  /**
   * Tear down the event listeners on the body.
   *
   * @method _destroyOutsideListener
   * @private
   */
  _destroyOutsideListener() {
    Ember.$('body').off(`click.${this.elementId}`);
  },

  // METHODS END ----------------------------------------

  // ACTIONS BEGIN ----------------------------------------

  actions: {

    clear() {
      set(this, '_dates', Ember.A());
      set(this, 'isToStep', false);
      this._sendAction();
      this._close();
    },

    selectToday() {
      let today = moment().startOf('day');
      if (get(this, 'range')) {
        set(this, '_dates', Ember.A([today, today]));
      } else {
        set(this, '_dates', Ember.A([today]));
      }

      this._sendAction();
      this.close();
    },

    toggleOpen() {
      if (get(this, 'isOpen')) {
        this._close();
      } else {
        this._open();
      }
    },

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
