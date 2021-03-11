import Controller from '@ember/controller';
import moment from 'moment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

/* eslint-disable no-console */
export default class UsageDateTimePickerController extends Controller {
  @tracked date1;
  date2 = moment().add(2, 'months');

  @action
  updateDate1(val) {
    this.date1 = val;
  }

  @action
  updateDateTime(date) {
    console.log(date);
  }
}
