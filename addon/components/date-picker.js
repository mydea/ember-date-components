import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/date-picker';

const {
  get,
  set,
  getProperties,
  computed
} = Ember;

export default Ember.Component.extend({
  layout,

  classNameBindings: ['classes.calendarContainerOuter'],

  selectedDate: null,
  currentView: 'month',
  currentMonth: null,
  currentYear: null,

  _minDate: null,
  _maxDate: null,

  showWeekdays: true,
  inline: false,
  placeholder: 'Select Date...',
  calendarWidth: 300,

  action: null,

  localization: {
    dateFormat: 'L',
    monthLongFormat: 'MMMM',
    monthShortFormat: 'MMM'
  },

  isOpen: false,
  _isOpen: false,

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

  previousMonth: computed('currentMonth', function () {
    return get(this, 'currentMonth').clone().subtract(1, 'month');
  }),

  nextMonth: computed('currentMonth', function () {
    return get(this, 'currentMonth').clone().add(1, 'month');
  }),

  canGotoPreviousMonth: computed('currentMonth', '_minDate', function () {
    let {
      _minDate,
      currentMonth
    } = getProperties(this, '_minDate', 'currentMonth');

    return !_minDate || _minDate.clone().startOf('month').valueOf() <= currentMonth.clone().subtract(1, 'month').valueOf();
  }),

  canGotoNextMonth: computed('currentMonth', '_maxDate', function () {
    let {
      _maxDate,
      currentMonth
    } = getProperties(this, '_maxDate', 'currentMonth');

    return !_maxDate || _maxDate.clone().startOf('month').valueOf() >= currentMonth.clone().add(1, 'month').valueOf();
  }),

  availableMonths: computed('currentYear', '_minDate', '_maxDate', function () {
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

  availableYears: computed('currentYear', '_minDate', '_maxDate', function () {
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

  _daysInMonth: computed('currentMonth', '_minDate', '_maxDate', function () {
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

  daysInMonth: computed('currentMonth', '_minDate', '_maxDate', function () {
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

  weekdays: computed(function () {
    let weekdays = moment.weekdaysMin();
    weekdays.push(weekdays.shift());
    return weekdays;
  }),

  today: computed(function () {
    return moment().startOf('day');
  }),

  showCalendar: computed('inline', '_isOpen', function () {
    return get(this, 'inline') || get(this, '_isOpen');
  }),

  translateX: null,

  init() {
    this._super(...arguments);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._setupAttributes();
  },

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

  _destroyOutsideListener() {
    Ember.$('body').off(`click.${this.elementId}`);
  },

  willDestroyElement() {
    this._super(...arguments);
    this._destroyOutsideListener();
  },

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

  selectDate(date) {
    set(this, 'selectedDate', date);
    this.gotoDate(date);
  },

  _getCurrentDate() {
    return moment();
  },

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

  _closePicker() {
    set(this, '_isOpen', false);
    this._destroyOutsideListener();
  },

  _sendAction() {
    let action = get(this, 'attrs.action');

    if (action) {
      let value = get(this, 'selectedDate');
      action(value);
    }
  },

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
