import Controller from '@ember/controller';
import moment from 'moment';
import { action } from '@ember/object';

/* eslint-disable no-console */
export default class UsageDatePickerController extends Controller {
  date2 = {
    value: moment().add(2, 'months'),
  };

  date3 = {
    min: moment().subtract(5, 'days'),
    max: moment().add(10, 'days'),
  };

  @action
  updateDate(date) {
    console.log(date);
  }
}
