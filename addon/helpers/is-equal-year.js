import Ember from 'ember';

export function isEqualYear([y1, y2]) {
  if (Ember.typeOf(y1) !== 'instance' || Ember.typeOf(y2) !== 'instance') {
    return false;
  }
  return y1.format('YYYY') === y2.format('YYYY');
}

export default Ember.Helper.helper(isEqualYear);
