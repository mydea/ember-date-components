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

  minDate: null,
  maxDate: null,

  showWeekdays: true,
  inline: false,
  placeholder: 'Select Date...',

  action: null,

  localization: {
    dateFormat: 'LL',
    monthLongFormat: 'MMMM',
    monthShortFormat: 'MMM'
  },

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

  canGotoPreviousMonth: computed('currentMonth', 'minDate', function () {
    let {
      minDate,
      currentMonth
    } = getProperties(this, 'minDate', 'currentMonth');

    return !minDate || minDate.clone().startOf('month').valueOf() <= currentMonth.clone().subtract(1, 'month').valueOf();
  }),

  canGotoNextMonth: computed('currentMonth', 'maxDate', function () {
    let {
      maxDate,
      currentMonth
    } = getProperties(this, 'maxDate', 'currentMonth');

    return !maxDate || maxDate.clone().startOf('month').valueOf() >= currentMonth.clone().add(1, 'month').valueOf();
  }),

  availableMonths: computed('currentYear', 'minDate', 'maxDate', function () {
    let {
      minDate,
      maxDate,
      currentYear
    } = getProperties(this, 'currentYear', 'minDate', 'maxDate');
    let months = Ember.A();

    for (let i = 0; i < 12; i++) {
      let month = currentYear.clone().add(i, 'month');
      if (minDate && month.valueOf() < minDate.valueOf()) {
        continue;
      }
      if (maxDate && month.valueOf() > maxDate.valueOf()) {
        continue;
      }
      months.push(month);
    }
    return months;
  }),

  availableYears: computed('currentYear', 'minDate', 'maxDate', function () {
    let {
      currentYear,
      minDate,
      maxDate
    } = getProperties(this, 'currentYear', 'minDate', 'maxDate');
    let years = Ember.A();
    let minYear, maxYear;

    if (minDate) {
      minYear = minDate.clone().startOf('year');
    } else {
      minYear = currentYear.clone().subtract(100, 'years');
    }

    if (maxDate) {
      maxYear = maxDate.clone().startOf('year');
    } else {
      maxYear = currentYear.clone().add(100, 'years');
    }

    for (let i = minYear.year(); i <= maxYear.year(); i++) {
      years.push(moment().year(i).startOf('year'));
    }

    return years;
  }),

  _daysInMonth: computed('currentMonth', 'minDate', 'maxDate', function () {
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

  daysInMonth: computed('currentMonth', 'minDate', 'maxDate', function () {
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

  init() {
    this._super(...arguments);
    this.set('_isOpen', false);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._setupAttributes();
  },

  _setupAttributes() {
    let initialValue = get(this, 'value');
    let {
      minDate,
      maxDate
    } = getProperties(this, 'minDate', 'maxDate');
    let currentDate = this._getCurrentDate();

    if (minDate) {
      set(this, 'minDate', minDate.clone().startOf('day'));
    }
    if (maxDate) {
      set(this, 'maxDate', maxDate.clone().startOf('day'));
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
      minDate,
      maxDate
    } = getProperties(this, 'minDate', 'maxDate');

    if (minDate && minDate.valueOf() > day.valueOf()) {
      return true;
    }
    if (maxDate && maxDate.valueOf() < day.valueOf()) {
      return true;
    }
    return false;
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
      this.toggleProperty('_isOpen');
      if (get(this, '_isOpen')) {
        this._setupOutsideListener();
      }
    }
  }
});
