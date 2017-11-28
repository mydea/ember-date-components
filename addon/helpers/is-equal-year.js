import Helper from '@ember/component/helper';
import moment from 'moment';

export function isEqualYear([y1, y2]) {
  if (!moment.isMoment(y1) || !moment.isMoment(y2)) {
    return false;
  }
  return y1.format('YYYY') === y2.format('YYYY');
}

export default Helper.helper(isEqualYear);
