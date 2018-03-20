import interactWithDatePicker from 'ember-date-components/helpers/interact-with-date-picker';
import { module, test } from 'qunit';
import $ from 'jquery';

function mockDom() {
  let container = document.createElement('div');

  let button1 = document.createElement('button');
  button1.setAttribute('data-test', 'date-picker-toggle-button');
  container.appendChild(button1);

  let button2 = document.createElement('button');
  button2.setAttribute('data-test', 'date-picker-toggle-button');
  container.appendChild(button2);

  return { container, button1, button2 };
}

module('Unit | Helper | interact with date picker', function() {

  test('it works with a plain DOM element', function(assert) {
    let { container, button1 } = mockDom();
    let datePicker = interactWithDatePicker(container);

    assert.equal(datePicker.element, container, 'element is correct');
    assert.equal(datePicker.buttonElement, button1, 'buttonElement is correct');
  });

  test('it works with a jQuery element', function(assert) {
    let { container, button1 } = mockDom();
    let $element = $(container);
    let datePicker = interactWithDatePicker($element);

    assert.equal(datePicker.element, $element, 'element is correct');

    let { buttonElement } = datePicker;
    assert.equal(buttonElement.length, 1, 'buttonElement is jQuery');
    assert.equal(buttonElement.get(0), button1, 'buttonElement is correct');
  });

});
