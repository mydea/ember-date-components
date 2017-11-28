import Ember from 'ember';
import moment from 'moment';

const {
  Controller,
  computed
} = Ember;

export default Controller.extend({

  date1: null,

  date2: computed(function() {
    return moment('2015-01-01');
  }),

  actions: {
    updateDate1(date) {
      this.set('date1', date);
    },
    updateDate2(date) {
      this.set('date2', date);
    }
  }
});
