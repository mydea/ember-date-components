import Ember from 'ember';

export function datePickerDayClasses([baseClass], { isToday=false, isSelected=false, isDisabled=false, isInactive=false }) {
  let isTodayClass = isToday ? ` ${baseClass}--today` : '';
  let isSelectedClass = isSelected ? ` ${baseClass}--selected` : '';
  let isDisabledClass = isDisabled ? ` ${baseClass}--disabled` : '';
  let isInactiveClass = isInactive ? ` ${baseClass}--inactive` : '';

  return `${baseClass}${isTodayClass}${isSelectedClass}${isDisabledClass}${isInactiveClass}`;
}

export default Ember.Helper.helper(datePickerDayClasses);
