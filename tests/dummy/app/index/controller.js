import { computed } from '@ember/object';
import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  disableDates: [moment(), moment().add(1, 'd')],
  minDate: moment(),

  date2: computed(function() {
    return {
      value: moment().add(2, 'months')
    };
  }),

  date3: computed(function() {
    return {
      min: moment().subtract(1, 'month'),
      max: moment().add(1, 'month').add(10, 'days')
    };
  }),

  actions: {
    updateDate() {
    },
    updateDateRange() {
    },
    updateTime() {
    },
    updateDateTime() {
    }
  }
});
