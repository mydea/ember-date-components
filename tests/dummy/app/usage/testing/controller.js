import Controller from '@ember/controller';
import moment from 'moment';
import { action } from '@ember/object';

/* eslint-disable no-console */
export default class UsageTestingController extends Controller {
  myOptions = [
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

  @action
  updateDateRange(vals) {
    console.log(vals);
  }

  @action
  updateDate(val) {
    console.log(val);
  }
}
