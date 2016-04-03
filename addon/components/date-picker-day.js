import Ember from 'ember';
import layout from '../templates/components/date-picker-day';

const {
  get,
  computed
} = Ember;

export default Ember.Component.extend({
  layout,

  tagName: 'button',

  classNameBindings: ['isDisabledClass', 'isTodayClass', 'isSelectedClass', 'isInactiveClass'],

  date: null,
  class: null,
  isDisabled: false,
  isToday: false,
  isSelected: false,
  isInactive: false,

  isDisabledClass: computed('class', 'isDisabled', function () {
    if (!get(this, 'isDisabled')) {
      return false;
    }
    return `${get(this, 'class')}--disabled`;
  }),

  isInactiveClass: computed('class', 'isInactive', function () {
    if (!get(this, 'isInactive')) {
      return false;
    }
    return `${get(this, 'class')}--inactive`;
  }),

  isTodayClass: computed('class', 'isToday', function () {
    if (!get(this, 'isToday')) {
      return false;
    }
    return `${get(this, 'class')}--today`;
  }),

  isSelectedClass: computed('class', 'isSelected', function () {
    if (!get(this, 'isSelected')) {
      return false;
    }
    return `${get(this, 'class')}--selected`;
  }),

  action: null,

  click() {
    let action = get(this, 'attrs.action');
    if (!get(this, 'isDisabled') && action) {
      action(get(this, 'date'));
    }
  }
});
