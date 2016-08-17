import Ember from 'ember';

export function isEqual([a, b]) {
  return a === b;
}

export default Ember.Helper.helper(isEqual);
