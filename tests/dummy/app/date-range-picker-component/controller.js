import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({

  date2: {
    value: moment().add(2, 'months')
  },

  date3: {
    min: moment().subtract(1, 'month'),
    max: moment().add(1, 'month').add(10, 'days')
  },

  actions: {
    updateDateRange(dateFrom, dateTo) {
      console.log(dateFrom, dateTo);
    }
  }
});
