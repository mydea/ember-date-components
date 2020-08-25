import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  getDatePicker,
  selectDateTime
} from 'ember-date-components/test-support/helpers/date-picker';
import { selectTime } from 'ember-date-components/test-support/helpers/time-picker';
import moment from 'moment';
import { set } from '@ember/object';

module('Integration | Component | date time picker', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) =>
      this.actions[actionName].apply(this, args);
  });

  test('time picker is disabled if no value is set', async function(assert) {
    await render(hbs`{{date-time-picker}}`);
    assert.dom('[data-time-picker-toggle-button]').isDisabled();
  });

  test('selecting a time works with a value pre-set', async function(assert) {
    assert.expect(8);

    let today = moment();

    this.actions.update = function(val) {
      assert.equal(val.hours(), 14, 'hours are correct');
      assert.equal(val.minutes(), 30, 'minutes are correct');
      assert.equal(val.seconds(), 0, 'seconds are correct');
      assert.equal(val.milliseconds(), 0, 'ms are correct');

      assert.equal(val.year(), today.year(), 'year remains the same');
      assert.equal(val.month(), today.month(), 'month remains the same');
      assert.equal(val.date(), today.date(), 'date remains the same');

      assert.equal(this.value, today, 'the value is not modified');
    };

    set(this, 'value', today);
    await render(
      hbs`{{date-time-picker value=value action=(action 'update')}}`
    );

    await selectTime(this.element, '14:30');
  });

  test('time picker is disabled if disabled=true', async function(assert) {
    await render(hbs`{{date-time-picker disabled=true value=(now)}}`);
    assert.dom('[data-time-picker-toggle-button]').isDisabled();
  });

  test('time-picker value is pre-filled', async function(assert) {
    let today = moment()
      .hours(14)
      .minutes(30)
      .seconds(0)
      .milliseconds(0);

    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value}}`);

    assert.dom('[data-time-picker-toggle-button]').hasText('02:30 pm');
  });

  test('ignoreZeroTime works', async function(assert) {
    let today = moment();
    today.hours(0);
    today.minutes(0);
    today.seconds(0);
    today.milliseconds(0);

    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value}}`);

    assert
      .dom('[data-time-picker-toggle-button]')
      .hasText('Enter time...', 'value is empty if time is 00:00');
  });

  test('ignoreZeroTime can be disabled', async function(assert) {
    let today = moment();
    today.hours(0);
    today.minutes(0);
    today.seconds(0);
    today.milliseconds(0);

    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value ignoreZeroTime=false}}`);

    assert
      .dom('[data-time-picker-toggle-button]')
      .hasText('12:00 am', 'value is 00:00 if ignoreZeroTime=false');
  });

  test('date picker is not disabled if no value is set', async function(assert) {
    await render(hbs`{{date-time-picker}}`);
    let datePicker = getDatePicker(this.element);
    assert.dom(datePicker.buttonElement).isNotDisabled();
  });

  test('date picker is disabled if disabled=true', async function(assert) {
    await render(hbs`{{date-time-picker disabled=true value=(now)}}`);

    let datePicker = getDatePicker(this.element);
    assert.dom(datePicker.buttonElement).hasAttribute('disabled');
  });

  test('selecting a date works without a value pre-set', async function(assert) {
    assert.expect(8);

    let today = moment('2017-05-13');

    this.actions.update = function(val) {
      assert.equal(val.hours(), today.hours(), 'hours remain the same');
      assert.equal(val.minutes(), today.minutes(), 'minutes remain the same');
      assert.equal(val.seconds(), today.seconds(), 'seconds remain the same');
      assert.equal(
        val.milliseconds(),
        today.milliseconds(),
        'ms remain the same'
      );

      assert.equal(val.year(), 2017, 'year is correct');
      assert.equal(val.month(), 4, 'month is correct');
      assert.equal(val.date(), 6, 'date is correct');

      assert.equal(this.value, today, 'the value is not modified');
    };

    set(this, 'value', today);
    await render(
      hbs`{{date-time-picker value=value action=(action 'update')}}`
    );

    let datePicker = getDatePicker(this.element);
    await datePicker.toggle();
    await datePicker.selectDate(moment('2017-05-06'));
  });

  test('selecting a date works with a value pre-set', async function(assert) {
    assert.expect(7);

    let today = moment();

    this.actions.update = function(val) {
      assert.equal(val.hours(), 0, 'hours defaults to 0');
      assert.equal(val.minutes(), 0, 'minutes defaults to 0');
      assert.equal(val.seconds(), 0, 'seconds defaults to 0');
      assert.equal(val.milliseconds(), 0, 'ms defaults to 0');

      assert.equal(val.year(), today.year(), 'year is correct');
      assert.equal(val.month(), today.month(), 'month is correct');
      assert.equal(val.date(), today.date(), 'date is correct');
    };

    await render(hbs`{{date-time-picker action=(action 'update')}}`);

    let datePicker = getDatePicker(this.element);
    await datePicker.toggle();
    await datePicker.selectDate(today);
  });

  test('date-picker value is pre-filled', async function(assert) {
    let today = moment('2017-05-13');
    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value}}`);

    let datePicker = getDatePicker(this.element);
    assert.equal(datePicker.buttonText(), today.format('L'));
  });

  test('date-picker placeholder is shown', async function(assert) {
    let placeholder = 'date-picker-placeholder';
    set(this, 'placeholder', placeholder);
    await render(hbs`{{date-time-picker datePlaceholder=placeholder}}`);

    assert
      .dom('[data-test-date-picker-toggle-button]')
      .hasText(placeholder, 'Custom placeholder is displayed in date button.');
  });

  test('time-picker placeholder is shown', async function(assert) {
    let placeholder = 'time-picker-placeholder';
    set(this, 'placeholder', placeholder);
    await render(hbs`{{date-time-picker timePlaceholder=placeholder}}`);

    assert
      .dom('[data-time-picker-toggle-button]')
      .hasText(placeholder, 'Custom placeholder is displayed in time button.');
  });

  test('time-picker button classes work', async function(assert) {
    let classes = 'time-button-class';
    set(this, 'classes', classes);
    await render(hbs`{{date-time-picker timePickerButtonClasses=classes}}`);

    assert
      .dom('[data-time-picker-toggle-button]')
      .hasClass(classes, 'Custom time button classes.');
  });

  test('setDateTime test helpers works', async function(assert) {
    assert.expect(3);

    this.actions.update = (val) => {
      assert.ok(true, 'update action is called');
      set(this, 'date', val);
    };

    this.date = null;
    await render(hbs`{{date-time-picker action=(action 'update') value=date}}`);

    let targetDate = moment()
      .add(2, 'day')
      .hours(5)
      .minutes(30);
    await selectDateTime(this.element, targetDate);

    assert.ok(
      this.date.format('YYYY-MM-DD HH:mm'),
      targetDate.format('YYYY-MM-DD HH:mm'),
      'date is correctly updated'
    );
  });
});
