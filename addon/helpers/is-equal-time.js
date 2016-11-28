import Ember from 'ember';
import moment from 'moment';

const {
  Helper,
  typeOf: getTypeOf
} = Ember;

const {isMoment} = moment;

export function isEqualTime([d1, d2]) {
  if (!isMoment(d1) || !isMoment(d2)) {
    return false;
  }

  return d1.format('HH:mm') === d2.format('HH:mm');
}

export default Helper.helper(isEqualTime);
