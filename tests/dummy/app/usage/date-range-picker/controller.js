import Controller from '@ember/controller';
import moment from 'moment';
import { action } from '@ember/object';

/* eslint-disable no-console */
export default class UsageDateRangePickerController extends Controller {
  date1 = {
    value: [moment().subtract(7, 'days'), moment().add(2, 'days')],
    min: moment().subtract(10, 'days'),
    max: moment().add(20, 'days'),
  };

  @action
  updateDateRange(vals) {
    console.log(vals);
  }
}
