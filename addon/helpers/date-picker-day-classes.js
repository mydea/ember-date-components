import Ember from 'ember';

export function datePickerDayClasses([baseClass], { isToday=false, isSelected=false, isDisabled=false, isInRange=false }) {
  let isTodayClass = isToday ? ` ${baseClass}--today` : '';
  let isSelectedClass = isSelected ? ` ${baseClass}--selected` : '';
  let isDisabledClass = isDisabled ? ` ${baseClass}--disabled` : '';
  let isInRangeClass = isInRange ? ` ${baseClass}--in-range` : '';

  return `${baseClass}${isTodayClass}${isSelectedClass}${isDisabledClass}${isInRangeClass}`;
}

export default Ember.Helper.helper(datePickerDayClasses);
