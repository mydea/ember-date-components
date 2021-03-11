import Controller from '@ember/controller';
import { action } from '@ember/object';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';

export default class ExampleDatePickerController extends Controller {
  @tracked date1 = null;
  @tracked date2 = moment('2015-01-01');

  @action
  updateDate1(date) {
    this.date1 = date;
  }

  @action
  updateDate2(date) {
    this.date2 = date;
  }
}
