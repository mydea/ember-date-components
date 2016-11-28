import Ember from 'ember';
import moment from 'moment';

const {
  Helper,
  typeOf: getTypeOf
} = Ember;

const {isMoment} = moment;

export function isEqualYear([y1, y2]) {
  if (!isMoment(y1) || !isMoment(y2)) {
    return false;
  }
  return y1.format('YYYY') === y2.format('YYYY');
}

export default Helper.helper(isEqualYear);
