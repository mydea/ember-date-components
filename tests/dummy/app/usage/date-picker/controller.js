import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({

  date2: {
    value: moment().add(2, 'months')
  },

  date3: {
    min: moment().subtract(5, 'days'),
    max: moment().add(10, 'days')
  },

  actions: {
    updateDate(date) {
      console.log(date);
    }
  }
});
