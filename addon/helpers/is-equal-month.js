import Helper from '@ember/component/helper';
import moment from 'moment';

export function isEqualMonth([m1, m2]) {
  if (!moment.isMoment(m1) || !moment.isMoment(m2)) {
    return false;
  }
  return m1.format('YYYY-MM') === m2.format('YYYY-MM');
}

export default Helper.helper(isEqualMonth);
