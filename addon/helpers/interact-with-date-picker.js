import $ from 'jquery';
import { click } from 'ember-native-dom-helpers';

export const interactWithDatePicker = function(element) {
  let $el = $(element);
  let $button = $el.find('[data-test="date-picker-toggle-button"]');

  let button = $button.get(0);
  let buttonTo = $button.get(1);

  return {
    buttonText() {
      return $button.text().trim();
    },

    toggle() {
      click(button);
    },

    toggleTo() {
      click(buttonTo);
    },

    select(date) {
      let button = $(`.date-picker button[data-test="day-${date.month()}-${date.date()}"]`).get(0);
      click(button);
    },

    nextMonth() {
      $('.date-picker .date-picker__header__button--next').click();
    },

    previousMonth() {
      $('.date-picker .date-picker__header__button--previous').click();
    },

    isOpen() {
      return !!$('.date-picker').length;
    },

    element: $el,
    buttonElement: $button
  };
};

export default interactWithDatePicker;
