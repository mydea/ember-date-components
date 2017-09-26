import Ember from 'ember';
import moment from 'moment';

const {
  Controller
} = Ember;

export default Controller.extend({

  date1: {
    value: null
  },

  date2: {
    value: moment().add(2, 'months')
  },

  date3: {
    min: moment().subtract(5, 'days'),
    max: moment().add(10, 'days')
  },

  actions: {
    updateDate1(val) {
      this.set('date1.value', val);
    },

    updateDateTime(date) {
      console.log(date);
    }
  }
});
