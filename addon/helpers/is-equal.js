import Helper from '@ember/component/helper';

export function isEqual([a, b]) {
  return a === b;
}

export default Helper.helper(isEqual);
