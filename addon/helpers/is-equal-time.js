import Ember from 'ember';
import moment from 'moment';

const {
  Helper
} = Ember;

export function isEqualTime([d1, d2]) {
  if (!moment.isMoment(d1) || !moment.isMoment(d2)) {
    return false;
  }

  return d1.format('HH:mm') === d2.format('HH:mm');
}

export default Helper.helper(isEqualTime);
