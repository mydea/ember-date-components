import Controller from '@ember/controller';
import moment from 'moment';
import { computed } from '@ember/object';

/* eslint-disable no-console */
export default Controller.extend({
  myOptions: computed(function () {
    return [
      'clear',
      'today',
      'thisWeek',
      {
        action: 'selectDateRange',
        label: 'Last 3 days',
        actionValue: [
          moment().startOf('day').subtract(3, 'days'),
          moment().startOf('day'),
        ],
      },
    ];
  }),

  actions: {
    updateDateRange(vals) {
      console.log(vals);
    },
    updateDate(val) {
      console.log(val);
    },
  },
});
