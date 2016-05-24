import Ember from 'ember';

export function isEqualDay([d1, d2]) {
  if (Ember.typeOf(d2) === 'array') {
    return d2.find((d2) => {
      if (Ember.typeOf(d1) !== 'instance' || Ember.typeOf(d2) !== 'instance') {
        return false;
      }

      return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
    });
  }

  if (Ember.typeOf(d1) !== 'instance' || Ember.typeOf(d2) !== 'instance') {
    return false;
  }
  return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
}

export default Ember.Helper.helper(isEqualDay);
