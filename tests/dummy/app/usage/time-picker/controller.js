import Controller from '@ember/controller';
import { action } from '@ember/object';

/* eslint-disable no-console */
export default class UsageTimePickerController extends Controller {
  @action
  updateTime(date) {
    console.log(date);
  }
}
