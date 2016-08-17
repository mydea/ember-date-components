import Ember from 'ember';

export function isEqualTime([d1, d2]) {
  if (!d1 || !d2) {
    return false;
  }

  return d1.format('HH:mm') === d2.format('HH:mm');
}

export default Ember.Helper.helper(isEqualTime);
