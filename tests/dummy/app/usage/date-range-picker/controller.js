import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({

  date1: {
    value: [moment().subtract(7, 'days'), moment().add(2, 'days')],
    min: moment().subtract(10, 'days'),
    max: moment().add(20, 'days')
  },

  actions: {
    updateDateRange(vals) {
      console.log(vals);
    }
  }
});
