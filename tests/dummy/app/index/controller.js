import { computed, set } from '@ember/object';
import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  date: null,
  time: null,

  date2: computed(function() {
    return {
      value: moment().add(2, 'months')
    };
  }),

  date3: computed(function() {
    return {
      min: moment().subtract(1, 'month'),
      max: moment()
        .add(1, 'month')
        .add(10, 'days')
    };
  }),

  actions: {
    updateDate(date) {
      set(this, 'date', date);
    },
    updateDateRange(dateRange) {
      set(this, 'dateRange', dateRange);
    },
    updateTime(time) {
      set(this, 'time', time);
    },
    updateDateTime(dateTime) {
      set(this, 'dateTime', dateTime);
    }
  }
});
