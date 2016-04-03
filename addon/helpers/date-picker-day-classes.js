import Ember from 'ember';

export function datePickerDayClasses([baseClass], { isToday, isSelected, isDisabled, isInactive }) {
  let isTodayClass = isToday ? ` ${baseClass}--today` : '';
  let isSelectedClass = isSelected ? ` ${baseClass}--selected` : '';
  let isDisabledClass = isDisabled ? ` ${baseClass}--disabled` : '';
  let isInactiveClass = isInactive ? ` ${baseClass}--inactive` : '';

  return `${baseClass}${isTodayClass}${isSelectedClass}${isDisabledClass}${isInactiveClass}`;
}

export default Ember.Helper.helper(datePickerDayClasses);
