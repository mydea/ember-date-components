import Ember from 'ember';

export function isEqualMonth([m1, m2]) {
  if (Ember.typeOf(m1) !== 'instance' || Ember.typeOf(m2) !== 'instance') {
    return false;
  }
  return m1.format('YYYY-MM') === m2.format('YYYY-MM');
}

export default Ember.Helper.helper(isEqualMonth);
