import Ember from 'ember';
import moment from 'moment';

const {
  Helper,
  typeOf: getTypeOf
} = Ember;

const {isMoment} = moment;

export function isEqualMonth([m1, m2]) {
  if (!isMoment(m1) || !isMoment(m2)) {
    return false;
  }
  return m1.format('YYYY-MM') === m2.format('YYYY-MM');
}

export default Helper.helper(isEqualMonth);
