import Ember from 'ember';
import moment from 'moment';

const {
  Helper,
  typeOf: getTypeOf
} = Ember;

export function isEqualDay([d1, d2]) {
  if (getTypeOf(d2) === 'array') {
    return !!d2.find((d2) => {
      if (!moment.isMoment(d1) || !moment.isMoment(d2)) {
        return false;
      }

      return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
    });
  }

  if (!moment.isMoment(d1) || !moment.isMoment(d2)) {
    return false;
  }

  return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
}

export default Helper.helper(isEqualDay);
