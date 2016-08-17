import Ember from 'ember';
import moment from 'moment';

const {
  Controller
} = Ember;

export default Controller.extend({

  date2: {
    value: moment().add(2, 'months')
  },

  date3: {
    min: moment().subtract(1, 'month'),
    max: moment().add(1, 'month').add(10, 'days')
  },

  actions: {
    updateDate() {
    },
    updateDateRange() {
    },
    updateTime() {
    }
  }
});
