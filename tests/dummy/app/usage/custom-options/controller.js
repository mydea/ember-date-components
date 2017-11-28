import Controller from '@ember/controller';
import moment from 'moment';

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
