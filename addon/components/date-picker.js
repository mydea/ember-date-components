import Ember from 'ember';
import layout from '../templates/components/date-picker';
import moment from 'moment';
import computed from 'ember-computed';
import $ from 'jquery';

const {
  get,
  set,
  Component,
  A: array,
  typeOf: getTypeOf,
  String: EmberString
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
export default Component.extend({
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
   *
   * @attribute placeholder
   * @type {String}
   * @default 'Select Date...'
   * @public
   */
  placeholder: 'Select Date...',

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
   * If custom options should be displayed.
   * If this is true, the default options for date-pickers/date-range-pickers will be shown.
   * It can also be an array, where the exact options are specified.
   *
   * @attribute options
   * @type {Boolean|Array}
   * @default false
   * @public
   */
  options: false,

  /**
   * If this is true, the date picker is disabled and the selected date cannot be changed.
   *
   * @attribute disabled
   * @type {Boolean}
   * @default false
   * @public
   */
  disabled: false,

  /**
   * The action to call whenever one of the value changes.
   *
   * @event action
   * @param {Date|Date[]} date Either a single date (or null) if `range=false`, or an array with two elements if `range=true`.
   * @public
   */
  action: null,

  /**
   * The action to call whenever the date picker is closed.
   *
   * @event action
   * @param {Date|Date[]} date Either a single date (or null) if `range=false`, or an array with two elements if `range=true`.
   * @public
   */
  closeAction: null,

  /**
   * Whether the calendar displays the week starting on Monday or Sunday.
   *
   * @attribute startWeekOnSunday
   * @type {Boolean}
   * @default false
   * @public
   */
  startWeekOnSunday: false,

  // ATTRIBUTES END ----------------------------------------

  // PROPERTIES BEGIN ----------------------------------------

  /**
   * A separator for the date range buttons.
   *
   * @property dateRangeSeparator
   * @type {String}
   * @default ' - '
   * @private
   */
  dateRangeSeparator: ' - ',

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
   * This will either return the placeholder, or the formatted date.
   *
   * @property buttonText
   * @type {String}
   * @readOnly
   * @private
   */
  buttonText: computed('range', '_dates.[]', function() {
    let isRange = get(this, 'range');
    let vals = get(this, '_dates') || array([]);
    let dateFormat = get(this, 'buttonDateFormat');

    let [dateFrom] = vals;

    if (!isRange) {
      if (!dateFrom) {
        return get(this, 'placeholder');
      }
      return dateFrom.format(dateFormat);
    }

    if (!dateFrom) {
      return get(this, 'placeholder');
    }

    return dateFrom.format(dateFormat);
  }),

  /**
   * The text for the to-button.
   * This is only used for date range pickers.
   * It will either return the placeholder, or the formatted date.
   *
   * @property buttonToText
   * @type {String}
   * @readOnly
   * @private
   */
  buttonToText: computed('range', '_dates.[]', function() {
    let vals = get(this, '_dates') || array([]);
    let dateFormat = get(this, 'buttonDateFormat');

    let [,dateTo] = vals;

    if (!dateTo) {
      return get(this, 'placeholder');
    }

    return dateTo.format(dateFormat);
  }),

  /**
   * If the (first) button is currently focused.
   *
   * @property buttonFocused
   * @type {Boolean}
   * @readOnly
   * @private
   */
  buttonFocused: computed('range', 'isOpen', 'isToStep', function() {
    let isRange = get(this, 'range');
    let isOpen = get(this, 'isOpen');
    let isToStep = get(this, 'isToStep');

    return isRange ? (isOpen && !isToStep) : (isOpen);
  }),

  /**
   * If the to-button is currently focused.
   *
   * @property buttonToFocused
   * @type {Boolean}
   * @readOnly
   * @private
   */
  buttonToFocused: computed('range', 'isOpen', 'isToStep', function() {
    let isRange = get(this, 'range');
    let isOpen = get(this, 'isOpen');
    let isToStep = get(this, 'isToStep');

    return isRange ? (isOpen && isToStep) : false;
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
    return array(arr);
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
  calendarWidth: computed('options', function() {
    let baseWidth = 280;
    let optionWidth = 140;

    return get(this, 'options') ? baseWidth + optionWidth : baseWidth;
  }),

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

  /**
   * These are the parsed options.
   * String/default options are converted into actual option objects via _optionsMap.
   *
   * @property _options
   * @type {Object[]}
   * @readOnly
   * @private
   */
  _options: computed('options.[]', function() {
    let options = get(this, 'options');
    let isRange = get(this, 'range');
    let optionsMap = get(this, '_optionsMap');

    if (!options) {
      return array();
    }

    // If options is true, return the default options depending on isRange
    if (getTypeOf(options) !== 'array') {
      options = isRange ? get(this, '_defaultDateRangeOptions') : get(this, '_defaultDateOptions');
    }

    return options.map((option) => {
      return getTypeOf(option) === 'string' ? optionsMap[option] : option;
    });
  }),

  /**
   * This maps how option names are mapped to actual options.
   * You can overwrite this if you want to have different option shortcuts.
   *
   * @property _optionsMap
   * @type {Object}
   * @private
   */
  _optionsMap: {
    'clear': {
      action: 'clearDate',
      label: 'Clear'
    },
    'today': {
      action: 'selectToday',
      label: 'Today'
    },
    'last7Days': {
      action: 'selectDateRange',
      label: 'Last 7 days',
      actionValue: [moment().startOf('day').subtract(6, 'days'), moment().startOf('day')]
    },
    'last30Days': {
      action: 'selectDateRange',
      label: 'Last 30 days',
      actionValue: [moment().startOf('day').subtract(29, 'days'), moment().startOf('day')]
    },
    'lastYear': {
      action: 'selectDateRange',
      label: 'Last year',
      actionValue: [moment().startOf('day').subtract(1, 'year').add(1, 'day'), moment().startOf('day')]
    },
    'last3Months': {
      action: 'selectDateRange',
      label: 'Last 3 months',
      actionValue: [moment().startOf('day').subtract(3, 'months').add(1, 'day'), moment().startOf('day')]
    },
    'last6Months': {
      action: 'selectDateRange',
      label: 'Last 6 months',
      actionValue: [moment().startOf('day').subtract(6, 'months').add(1, 'day'), moment().startOf('day')]
    },
    'thisWeek': {
      action: 'selectDateRange',
      label: 'This week',
      actionValue: [moment().startOf('isoweek'), moment().startOf('day')]
    },
    'thisMonth': {
      action: 'selectDateRange',
      label: 'This month',
      actionValue: [moment().startOf('month'), moment().startOf('day')]
    }
  },

  /**
   * The default options for date pickers.
   * You can overwrite this if you want different default options.
   *
   * @property _defaultDateOptions
   * @type {Array}
   * @private
   */
  _defaultDateOptions: array([
    'clear',
    'today'
  ]),

  /**
   * The default options for date range pickers.
   * you can overwrite this if you want different default options.
   *
   * @property _defaultDateRangeOptions
   * @type {Array}
   * @private
   */
  _defaultDateRangeOptions: array([
    'clear',
    'today',
    'last7Days',
    'last30Days',
    'last3Months'
  ]),

  // PROPERTIES END ----------------------------------------

  // HOOKS BEGIN ----------------------------------------

  didReceiveAttrs() {
    this._super(...arguments);
    this._setupValue();
  },

  willDestroyElement() {
    this._destroyOutsideListener();
    this._super(...arguments);
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
      if (getTypeOf(val) !== 'array') {
        val = array([val]);
      }
    } else {
      val = array();
    }

    set(this, '_dates', val);

    if (val.length > 0) {
      let month = val[0] ? val[0].clone().startOf('month') : moment().startOf('month');
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

    if (action && !get(this, 'disabled')) {
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

    let windowWidth = $(window).width();
    let elLeftOffset = $el.offset().left;
    let elOffset = elLeftOffset + get(this, 'calendarWidth');

    if (elOffset > windowWidth) {
      let translate = elOffset - windowWidth + 10;
      let style = EmberString.htmlSafe(`transform: translate(-${translate}px, 0)`);
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
    set(this, 'isToStep', false);

    let action = get(this, 'attrs.closeAction');
    let vals = get(this, '_dates');
    let isRange = get(this, 'range');

    if (action) {
      action(isRange ? vals : vals[0] || null);
    }

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
    let vals = array([date]);
    set(this, '_dates', vals);
    this._close();
    return vals;
  },

  /**
   * Set the from date to the selected date.
   * It might also switch the to-date with the from-date if the to-date is before the from-date.
   *
   * @method _setFromDate
   * @param date
   * @private
   */
  _setFromDate(date) {
    let dates = get(this, '_dates');
    let [, dateTo] = dates;
    let vals;

    if (dateTo && date.valueOf() > dateTo.valueOf()) {
      vals = array([date, null]);
    } else {
      vals = array([date, dateTo || null]);
    }

    set(this, '_dates', vals);
  },

  /**
   * Set the to date to the selected date.
   * It might also switch the to-date with the from-date if the to-date is before the from-date.
   *
   * @method _setToDate
   * @param date
   * @private
   */
  _setToDate(date) {
    let dates = get(this, '_dates');
    let [dateFrom] = dates;
    let vals;

    if (date) {
      date = date.endOf('day');
    }

    if (date && (dateFrom && date.valueOf() < dateFrom.valueOf())) {
      vals = array([date, dateFrom]);
    } else {
      vals = array([dateFrom, date]);
    }

    set(this, '_dates', vals);
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
    let isToStep = get(this, 'isToStep');

    if (!isToStep) {
      this._setFromDate(date);
      this._moveToToStep();
    } else {
      this._setToDate(date);
      this._close();
    }
  },

  /**
   * Move to the from step.
   * This will set the current month to the month of the from-step (if a from-date is set)
   *
   * @method _moveToFromStep
   * @private
   */
  _moveToFromStep() {
    let [month] = get(this, '_dates') || array();
    if (month) {
      set(this, 'currentMonth', month.clone().startOf('month'));
    }
    set(this, 'isToStep', false);
  },

  /**
   * Move to the to step.
   * This will set the current month to the month of the to-step (if a to-date is set)
   *
   * @method _moveToToStep
   * @private
   */
  _moveToToStep() {
    let [,month] = get(this, '_dates') || array();
    if (month) {
      set(this, 'currentMonth', month.clone().startOf('month'));
    }
    set(this, 'isToStep', true);
  },

  /**
   * Move to the from date and open the date picker.
   *
   * @method _openFromDate
   * @private
   */
  _openFromDate() {
    this._moveToFromStep();
    this._open();
  },

  /**
   * Move to the to step and open the date picker.
   *
   * @method _openToDate
   * @private
   */
  _openToDate() {
    this._moveToToStep();
    this._open();
  },

  /**
   * Setup an event listener on the body to auto-close the date-picker if the user clicks outside.
   *
   * @method _setupOutsideListener
   * @private
   */
  _setupOutsideListener() {
    let $element = this.$();

    $('body').on(`click.${this.elementId}`, (e) => {
      if (this.get('isDestroyed')) {
        return;
      }
      let $target = $(e.target);
      if (!$target.hasClass('date-picker__day') && !$target.closest($element).length) {
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
    $('body').off(`click.${this.elementId}`);
  },

  // METHODS END ----------------------------------------

  // ACTIONS BEGIN ----------------------------------------

  actions: {

    clearDate() {
      set(this, '_dates', array());
      set(this, 'isToStep', false);
      this._sendAction();
      this._close();
    },

    selectToday() {
      let today = moment().startOf('day');
      if (get(this, 'range')) {
        set(this, '_dates', array([today, today]));
      } else {
        set(this, '_dates', array([today]));
      }

      this._sendAction();
      this._close();
    },

    toggleOpen() {
      let isOpen = get(this, 'isOpen');
      let isRange = get(this, 'range');
      let isToStep = get(this, 'isToStep');

      if (!isRange) {
        if (isOpen) {
          this._close();
        } else {
          this._openFromDate();
        }
        return;
      }

      if (isOpen) {
        // If it is a range picker, either close it or switch to isToStep=false
        if (isToStep) {
          this._moveToFromStep();
        } else {
          this._close();
        }
      } else {
        this._openFromDate();
      }
    },

    toggleOpenTo() {
      let isOpen = get(this, 'isOpen');
      let isToStep = get(this, 'isToStep');

      if (isOpen) {
        if (!isToStep) {
          this._moveToToStep();
        } else {
          this._close();
        }
      } else {
        this._openToDate();
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

    selectDate(date) {
      let isRange = get(this, 'range');

      if (!isRange) {
        this._setSingleDate(date);
      } else {
        this._setDateRange(date);
      }

      this._sendAction();
    },

    selectDateRange(dates) {
      set(this, '_dates', array(dates));

      this._sendAction();
      this._close();
    }
  }

  // ACTIONS END ----------------------------------------
});
