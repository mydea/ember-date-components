import Ember from 'ember';

const {
  Helper,
  typeOf: getTypeOf
} = Ember;

export function isEqualDay([d1, d2]) {
  if (getTypeOf(d2) === 'array') {
    return d2.find((d2) => {
      if (getTypeOf(d1) !== 'instance' || getTypeOf(d2) !== 'instance') {
        return false;
      }

      return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
    });
  }

  if (getTypeOf(d1) !== 'instance' || getTypeOf(d2) !== 'instance') {
    return false;
  }
  return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
}

export default Helper.helper(isEqualDay);
