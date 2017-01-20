import $ from 'jquery';

export const interactWithDatePicker = function(element) {
  let $el = $(element);
  let $button = $el.find('[data-test="date-picker-toggle-button"]');

  return {
    buttonText() {
      return $button.text().trim();
    },

    toggle() {
      $button.click();
    },

    select(date) {
      $el.find(`button[data-test="day-${date.month()}-${date.date()}"]`).click();
    },

    nextMonth() {
      $el.find('.date-picker__header__button--next').click();
    },

    previousMonth() {
      $el.find('.date-picker__header__button--previous').click();
    },

    element: $el,
    buttonElement: $button
  };
};

export default interactWithDatePicker;
