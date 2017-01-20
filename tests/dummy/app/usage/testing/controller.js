import Ember from 'ember';
import moment from 'moment';

const {
  Controller
} = Ember;

export default Controller.extend({

  myOptions: ['clear',
    'today',
    'thisWeek',
    {
      action: 'selectDateRange',
      label: 'Last 3 days',
      actionValue: [moment().startOf('day').subtract(3, 'days'), moment().startOf('day')]
    }
  ],

  actions: {
    updateDateRange(vals) {
      console.log(vals);
    },
    updateDate(val) {
      console.log(val);
    }
  }
});
