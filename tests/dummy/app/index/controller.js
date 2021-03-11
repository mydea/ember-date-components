import { action } from '@ember/object';
import Controller from '@ember/controller';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';

export default class ExampleIndexController extends Controller {
  @tracked date;
  @tracked time;
  @tracked dateRange;
  @tracked dateTime;

  date2 = {
    value: moment().add(2, 'months'),
  };

  date3 = {
    min: moment().subtract(1, 'month'),
    max: moment().add(1, 'month').add(10, 'days'),
  };

  @action
  updateDate(date) {
    this.date = date;
  }

  @action
  updateDateRange(dateRange) {
    this.dateRange = dateRange;
  }

  @action
  updateTime(time) {
    this.time = time;
  }

  @action
  updateDateTime(dateTime) {
    this.dateTime = dateTime;
  }
}
