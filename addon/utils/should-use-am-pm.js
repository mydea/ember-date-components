import moment from 'moment';

export function shouldUseAmPm() {
  return moment().startOf('day').format('LLL').toLowerCase().indexOf('am') > -1;
}

export default shouldUseAmPm;
