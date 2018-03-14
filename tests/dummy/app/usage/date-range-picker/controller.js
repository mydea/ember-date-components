import Controller from '@ember/controller';
import moment from 'moment';
import { computed } from '@ember/object';

/* eslint-disable no-console */
export default Controller.extend({

  date1: computed(function() {
    return {
      value: [moment().subtract(7, 'days'), moment().add(2, 'days')],
      min: moment().subtract(10, 'days'),
      max: moment().add(20, 'days')
    };
  }),

  actions: {
    updateDateRange(vals) {
      console.log(vals);
    }
  }
});
