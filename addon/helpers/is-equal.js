import Ember from 'ember';

const {
  Helper
} = Ember;

export function isEqual([a, b]) {
  return a === b;
}

export default Helper.helper(isEqual);
