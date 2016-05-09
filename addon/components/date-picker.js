import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/date-picker';

const {
  get,
  set,
  getProperties,
  computed
} = Ember;

/**
 * A flexible date picker component.
 *
 * ```hbs
 * {{date-picker value=myDate action=(action 'updateDate')}}
 * ```
 *
 * @namespace EmberDateComponents.Components
 * @class DatePicker
 * @extends Ember.Component
 * @public
 */
export default Ember.Component.extend({
  layout,
  classNameBindings: ['classes.calendarContainerOuter'],

  // ATTRIBUTES BEGIN ----------------------------------------

  /**
   * The initial value for the date picker.
   * This is not two-way data bound.
   * Whenever this value changes, the date picker will automatically move to the selected month.
   *
   * @attribute value
   * @type {Date}
   * @optional
   * @public
   */
  value: null,

  /**
   * The minimum date that can be selected.
   * No date before this date will be selectable.
   * It will also be impossible to move to months/years outside of the provided bounds.
   *
   * @attribute minDate
   * @type {Date}
   * @default null
   * @public
   */
  minDate: null,

  /**
   * The maximum date that can be selected.
   * No date after this date will be selectable.
   * It will also be impossible to move to months/years outside of the provided bounds.
   *
   * @attribute maxDate
   * @type {Date}
   * @default null
   * @public
   */
  maxDate: null,

  /**
   * If this is set to false, the weekdays will not be displayed in the calendar.
   *
   * @attribute showWeekdays
   * @type {Boolean}
   * @default true
   * @public
   */
  showWeekdays: true,

  /**
   * If this is true, the inlined date-picker will be always visible.
   * In this case, no button to open the date picker will be shown.
   *
   * @attribute inline
   * @type {Boolean}
   * @default false
   * @public
   */
  inline: false,

  /**
   * The placeholder for the open toggle.
   * This placeholder will be shown if no value has been selected. It has no effect if `inline=true`.
   *
   * @attribute placeholder
   * @type {String}
   * @default 'Select Date...'
   * @public
   */
  placeholder: 'Select Date...',

  /**
   * The width of the calendar widget. If you use the default styling, this will be 300.
   * If you do not use the default styling, change this to the value you use.
   * This is used to calculate the correct position of the calendar if it would run out of the window on the right side.
   *
   * @attribute calendarWidth
   * @type {Number}
   * @default 300
   * @public
   */
  calendarWidth: 300,

  /**
   * If this is set to true, the calendar will be opened by default.
   * This has no effect if `inline=true`.
   *
   * @attribute isOpen
   * @type {Boolean}
   * @default false
   * @public
   */
  isOpen: false,

  /**
   * The action to call whenever the value changes.
   *
   * @event action
   * @param {Date} date The selected date
   * @public
   */
  action: null,

  /**
   * This property contains the formats used to render the dates & month names.
   * Overwrite this if you want to have a different output.
   *
   * @attribute localization
   * @type {Object}
   * @public
   */
  localization: {
    dateFormat: 'L',
    monthLongFormat: 'MMMM',
    monthShortFormat: 'MMM'
  },

  /**
   * This property contains the class names used for the different elements of the date picker.
   * Overwrite this if you want to have different classes.
   *
   * @attribute classes
   * @type {Object}
   * @public
   */
  classes: {
    calendarContainerOuter: 'date-picker__outer',
    calendarContainer: 'date-picker',
    calendarContainerInline: 'date-picker--inline',
    toggleButton: 'date-picker__button',
    monthHeader: 'date-picker__month__header',
    yearCurrent: 'date-picker__year__current',
    monthCurrent: 'date-picker__month__current',
    monthCurrentDisplay: 'date-picker__month__current__display',
    monthCurrentSelect: 'date-picker__month__current__select',
    monthButton: 'date-picker__month__button',
    monthButtonDisabled: 'date-picker__month__button--disabled',
    monthButtonPrevious: 'date-picker__month__button--previous',
    monthButtonNext: 'date-picker__month__button--next',
    calendarOuter: 'date-picker__calendar',
    calendarHeader: 'date-picker__header',
    calendarHeaderWeekday: 'date-picker__header__weekday',
    calendarInner: 'date-picker__calendar__days',
    day: 'date-picker__day'
  },
  // ATTRIBUTES END ----------------------------------------

  // PROPERTIES BEGIN ----------------------------------------

  /**
   * The currently selected date.
   *
   * @property selectedDate
   * @type {Date}
   * @private
   */
  selectedDate: null,

  /**
   * The currently visible month.
   * This will always be a moment.js-instance with `.startOf('month')` set.
   *
   * @property currentMonth
   * @type {Date}
   * @private
   */
  currentMonth: null,

  /**
   * The currently visible year.
   * This will always be a moment.js-instance with `.startOf('year')` set.
   *
   * @property currentYear
   * @type {Date}
   * @private
   */
  currentYear: null,

  /**
   * The internally used version of isOpen.
   * This is duplicated to prevent two-way data binding.
   *
   * @property _isOpen
   * @type {Boolean}
   * @private
   */
  _isOpen: null,

  /**
   * The internally used version of minDate.
   * This is duplicated to prevent two-way data binding.
   *
   * @property _minDate
   * @type {Date}
   * @private
   */
  _minDate: null,

  /**
   * The internally used version of maxDate.
   * This is duplicated to prevent two-way data binding.
   *
   * @property _maxDate
   * @type {Date}
   * @private
   */
  _maxDate: null,

  /**
   * The month before the currently selected month.
   *
   * @property previousMonth
   * @type {Date}
   * @readOnly
   * @private
   */
  previousMonth: computed('currentMonth', function() {
    return get(this, 'currentMonth').clone().subtract(1, 'month');
  }),

  /**
   * The month after the currently selected month.
   *
   * @property nextMonth
   * @type {Date}
   * @readOnly
   * @private
   */
  nextMonth: computed('currentMonth', function() {
    return get(this, 'currentMonth').clone().add(1, 'month');
  }),

  /**
   * If it is possible to go to the previous month.
   * This depends on the minDate.
   *
   * @property canGotoPreviousMonth
   * @type {Boolean}
   * @readOnly
   * @private
   */
  canGotoPreviousMonth: computed('currentMonth', '_minDate', function() {
    let {
      _minDate,
      currentMonth
    } = getProperties(this, '_minDate', 'currentMonth');

    return !_minDate || _minDate.clone().startOf('month').valueOf() <= currentMonth.clone().subtract(1, 'month').valueOf();
  }),

  /**
   * If it is possible to go to the next month.
   * This depends on the maxDate.
   *
   * @property canGotoNextMonth
   * @type {Boolean}
   * @readOnly
   * @private
   */
  canGotoNextMonth: computed('currentMonth', '_maxDate', function() {
    let {
      _maxDate,
      currentMonth
    } = getProperties(this, '_maxDate', 'currentMonth');

    return !_maxDate || _maxDate.clone().startOf('month').valueOf() >= currentMonth.clone().add(1, 'month').valueOf();
  }),

  /**
   * The available months to select from.
   * By default, this will be January - December.
   * However, depending on minDate & maxDate, some months might not be available.
   * For example, if minDate = April 5th, March, February & January will not be selectable.
   *
   * @property availableMonths
   * @type {Date[]}
   * @readOnly
   * @private
   */
  availableMonths: computed('currentYear', '_minDate', '_maxDate', function() {
    let {
      _minDate,
      _maxDate,
      currentYear
    } = getProperties(this, 'currentYear', '_minDate', '_maxDate');
    let months = Ember.A();

    for (let i = 0; i < 12; i++) {
      let month = currentYear.clone().add(i, 'month');
      if (_minDate && month.valueOf() < _minDate.valueOf()) {
        continue;
      }
      if (_maxDate && month.valueOf() > _maxDate.valueOf()) {
        continue;
      }
      months.push(month);
    }
    return months;
  }),

  /**
   * The available years to select from.
   * By default, this will be +/- 100 years.
   * However, depending on minDate & maxDate, some years might not be available.
   *
   * @property availableYears
   * @type {Date[]}
   * @readOnly
   * @private
   */
  availableYears: computed('currentYear', '_minDate', '_maxDate', function() {
    let {
      currentYear,
      _minDate,
      _maxDate
    } = getProperties(this, 'currentYear', '_minDate', '_maxDate');
    let years = Ember.A();
    let minYear, maxYear;

    if (_minDate) {
      minYear = _minDate.clone().startOf('year');
    } else {
      minYear = currentYear.clone().subtract(100, 'years');
    }

    if (_maxDate) {
      maxYear = _maxDate.clone().startOf('year');
    } else {
      maxYear = currentYear.clone().add(100, 'years');
    }

    for (let i = minYear.year(); i <= maxYear.year(); i++) {
      years.push(moment().year(i).startOf('year'));
    }

    return years;
  }),

  /**
   * The currently displayed days in the calendar.
   * This will contain all the days of the current month,
   * prepended with days to fill a started week in the beginning of the month,
   * appended with days to fill a started week in the end of the month.
   * This means that the array length will always be divisible by 7.
   * The generated objects contain the reference to the used date, as well as various other pieces of information:
   *
   * ```js
   * {
   *    date: day,
   *    dateString: day.format('YYYY-MM-DD'),
   *    year: day.year(),
   *    month: day.month(),
   *    day: day.date(),
   *    weekday: day.isoWeekday(),
   *    disabled: this._dayIsDisabled(day),
   *    notInCurrentMonth: true
   * }
   * ```
   *
   * @property daysInMonth
   * @type {Object[]}
   * @readOnly
   * @private
   */
  daysInMonth: computed('currentMonth', '_minDate', '_maxDate', function() {
    let currentMonth = get(this, 'currentMonth');
    let daysInMonth = currentMonth.daysInMonth();
    let days = Ember.A();

    // start with days from previous month to fill up first week
    let firstWeekday = currentMonth.isoWeekday();
    for (let i = firstWeekday; i > 1; i--) {
      let day = currentMonth.clone().subtract(i - 1, 'days');
      let dayObject = {
        date: day,
        dateString: day.format('YYYY-MM-DD'),
        year: day.year(),
        month: day.month(),
        day: day.date(),
        weekday: day.isoWeekday(),
        disabled: this._dayIsDisabled(day),
        notInCurrentMonth: true
      };

      days.push(dayObject);
    }

    // create one day object for every day in the month
    for (let i = 0; i < daysInMonth; i++) {
      let day = currentMonth.clone().add(i, 'days');
      let dayObject = {
        date: day,
        dateString: day.format('YYYY-MM-DD'),
        year: day.year(),
        month: day.month(),
        day: day.date(),
        weekday: day.isoWeekday(),
        disabled: this._dayIsDisabled(day),
        notInCurrentMonth: false
      };

      days.push(dayObject);
    }

    // end with days from next month to fill up last week
    let lastWeekday = currentMonth.clone().endOf('month').isoWeekday();
    for (let i = 1; i <= 7 - lastWeekday; i++) {
      let day = currentMonth.clone().endOf('month').add(i, 'days');
      let dayObject = {
        date: day,
        dateString: day.format('YYYY-MM-DD'),
        year: day.year(),
        month: day.month(),
        day: day.date(),
        weekday: day.isoWeekday(),
        disabled: this._dayIsDisabled(day),
        notInCurrentMonth: true
      };

      days.push(dayObject);
    }

    return days;
  }),

  /**
   * The localized weekdays, starting with monday.
   *
   * @property weekdays
   * @type {String[]}
   * @readOnly
   * @private
   */
  weekdays: computed(function() {
    let weekdays = moment.weekdaysMin();
    weekdays.push(weekdays.shift());
    return weekdays;
  }),

  /**
   * The current day.
   *
   * @property today
   * @type {Date}
   * @readOnly
   * @private
   */
  today: computed(function() {
    return moment().startOf('day');
  }),

  /**
   * If the calendar should be shown or not.
   * This is true if either `inline=true` or `isOpen=true`.
   *
   * @property showCalendar
   * @type {Boolean}
   * @readOnly
   * @private
   */
  showCalendar: computed('inline', '_isOpen', function() {
    return get(this, 'inline') || get(this, '_isOpen');
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
  // PROPERTIES END ----------------------------------------

  // HOOKS BEGIN ----------------------------------------
  didReceiveAttrs() {
    this._super(...arguments);
    this._setupAttributes();
  },
  willDestroyElement() {
    this._super(...arguments);
    this._destroyOutsideListener();
  },
  // HOOKS END ----------------------------------------

  // METHODS BEGIN ----------------------------------------

  /**
   * Take the given attributes and setup the date picker.
   * This is called by didReceiveAttrs.
   * It creates local copies of minDate, maxDate and isOpen to prevent two-way data-binding.
   * It will also set minDate/maxDate to the start of their day via `.startOf('day')`.
   * If a value is provided, the calendar will move to this value.
   * Else, it will move to the current day.
   *
   * @method _setupAttributes
   * @private
   */
  _setupAttributes() {
    let initialValue = get(this, 'value');
    let {
      minDate,
      maxDate,
      isOpen
    } = getProperties(this, 'minDate', 'maxDate', 'isOpen');
    let currentDate = this._getCurrentDate();

    if (minDate) {
      set(this, '_minDate', minDate.clone().startOf('day'));
    }
    if (maxDate) {
      set(this, '_maxDate', maxDate.clone().startOf('day'));
    }

    set(this, '_isOpen', isOpen || false);
    if (isOpen) {
      Ember.run.schedule('afterRender', this, this._setupOutsideListener);
    }

    if (initialValue) {
      this.selectDate(initialValue);
    } else {
      this.gotoDate(currentDate);
    }
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
        this.set('_isOpen', false);
        this._destroyOutsideListener();
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

  /**
   * Go to the selected date in the calendar.
   *
   * @method gotoDate
   * @param {date} date The date to go to.
   * @private
   */
  gotoDate(date) {
    if (!date) {
      date = moment();
    }
    let currentYear = date.clone().startOf('year');
    let currentMonth = date.clone().startOf('month');

    // If it is in the same month, do not reset month & year to prevent re-rendering
    let oldCurrentMonth = get(this, 'currentMonth');
    if (oldCurrentMonth && currentMonth.format('YYYY-MM') === oldCurrentMonth.format('YYYY-MM')) {
      return;
    }

    this.setProperties({
      currentMonth,
      currentYear
    });
  },

  /**
   * Select a date in the calendar and move to this date.
   *
   * @method selectDate
   * @param {Date} date The date to select.
   * @private
   */
  selectDate(date) {
    set(this, 'selectedDate', date);
    this.gotoDate(date);
  },

  /**
   * Get the current date.
   *
   * @method _getCurrentDate
   * @return {Date}
   * @private
   */
  _getCurrentDate() {
    return moment();
  },

  /**
   * Check if a date is disabled.
   * This checks if the date is inside of minDate/maxDate.
   *
   * @method _dayIsDisabled
   * @param {Date} day The date to check
   * @return {Boolean}
   * @private
   */
  _dayIsDisabled(day) {
    let {
      _minDate,
      _maxDate
    } = getProperties(this, '_minDate', '_maxDate');

    if (_minDate && _minDate.valueOf() > day.valueOf()) {
      return true;
    }
    if (_maxDate && _maxDate.valueOf() < day.valueOf()) {
      return true;
    }
    return false;
  },

  /**
   * Open the date picker.
   *
   * @method _openPicker
   * @private
   */
  _openPicker() {
    set(this, '_isOpen', true);
    this._setupOutsideListener();

    // Check if position is outside of window
    // this happens if the date picker is at the right side of the screen
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
   * @method _closePicker
   * @private
   */
  _closePicker() {
    set(this, '_isOpen', false);
    this._destroyOutsideListener();
  },

  /**
   * Send the update action.
   *
   * @method _sendAction
   * @private
   */
  _sendAction() {
    let action = get(this, 'attrs.action');

    if (action) {
      let value = get(this, 'selectedDate');
      action(value);
    }
  },

  // METHODS END ----------------------------------------

  actions: {
    selectDate(date) {
      this.selectDate(date);
      this._sendAction();
      set(this, '_isOpen', false);
    },

    selectDateString(dateString, isDisabled) {
      if (!isDisabled) {
        let date = moment(dateString, 'YYYY-MM-DD');
        this.selectDate(date);
        this._sendAction();
        set(this, '_isOpen', false);
      }
    },

    gotoNextMonth() {
      if (!get(this, 'canGotoNextMonth')) {
        return;
      }
      let month = get(this, 'nextMonth');
      this.gotoDate(month);
    },

    gotoPreviousMonth() {
      if (!get(this, 'canGotoPreviousMonth')) {
        return;
      }
      let month = get(this, 'previousMonth');
      this.gotoDate(month);
    },

    gotoMonth(m) {
      let date = get(this, 'currentYear').clone().month(m - 1);
      this.gotoDate(date);
    },

    gotoYear(y) {
      let date = get(this, 'currentMonth').clone().year(y);
      this.gotoDate(date);
    },

    gotoDate(date) {
      this.gotoDate(date);
    },

    clear() {
      this.selectDate(null);
    },

    toggleOpen() {
      if (get(this, '_isOpen')) {
        this._closePicker();
      } else {
        this._openPicker();
      }
    }
  }
});
